// [1,2,3,4,5,6].diff( [3,4,5] );  => [1, 2, 6]
// Array.prototype.diff = function(a) {
//   return this.filter(function(i) {
//     return a.indexOf(i) < 0;
//   });
// };

// [1, 2, [3, 4]].equals([1, 2, [3, 2]]) === false;
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
  // if the other array is a falsy value, return
  if(!array)
    return false;

  // compare lengths - can save a lot of time
  if(this.length != array.length)
    return false;

  for(var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if(this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if(!this[i].equals(array[i]))
        return false;
    }
    else if(this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

Meteor.Collection.prototype.vermongo = function(op) {
  var collection = this;
  //console.log('[Vermongo]', collection._name, op);
  var options = op || {};
  options.userId = options.userId || false;
  options.ignoredFields = options.ignoredFields || [];
  var offOnce = false;
  var _versions_collection = null;

  // Setting hooks for a collection
  var add = function(collection) {
    var name = collection._name;

    // create a new collection if not already existing
    _versions_collection = new Meteor.Collection(name + '.vermongo');

    // copy Doc in vermongo collection
    var copyDoc = function(doc) {
      if(Meteor.isServer) { // avoid duplicated insertion
        // copy doc to versions collection
        var savedDoc = _.extend({}, doc); // shallow copy
        if(typeof(savedDoc._id) !== 'undefined' && !savedDoc._deleted) delete savedDoc._id;
        if(!savedDoc._deleted) savedDoc.ref = doc._id;

        _versions_collection.insert(savedDoc);
      }
    };

    /*
     * insert hook
     * Beware that collection2 validation occurs *before* this callback
     * */
    collection.before.insert(function(userId, doc) {
      // do nothing if special option is set
      if(offOnce) {
        offOnce = false;
        return;
      }
      // add vermongo fields
      doc._version = 1;
      if(options['timestamps']) {
        var now = new Date();
        if(!doc.createdAt) doc.createdAt = now;
        if(!doc.modifiedAt) doc.modifiedAt = now;
      }

      if(!doc[options.userId] && options.userId && userId) {
        var user = Meteor.users.findOne(userId);
        doc[options.userId] = user.username;
        doc["changes"] = {'created': 1, 'added': doc.content};
      }

      // ProcDescContentSchema.clean(doc.content);
      if (typeof doc.content !== "undefined") {
        var hash = CryptoJS.SHA512(JSON.stringify(doc.content)).toString();
        doc.documentHash = hash;
      }

      copyDoc(doc);

    });

    /*
     * before update hook
     * */
    collection.before.update(function(userId, doc, fieldNames, modifier, hook_options) {
      // do nothing if special option is set
      if(offOnce) {
        offOnce = false;
        return;
      }
      // do nothing if only ignored fields are modified
      // if(fieldNames.diff(options.ignoredFields).equals([])) return;

      // incrementing version
      modifier.$set = modifier.$set || {};
      var originalSet = _.extend({}, modifier.$set);

      // in case of doc not already versionned
      if(!doc._version) doc._version = 1;

      // copyDoc(doc);

      modifier.$set._version = doc._version + 1;

      if(options['timestamps'])
        modifier.$set.modifiedAt = new Date();
      if(doc[options.userId] && options.userId && userId) {
        var user = Meteor.users.findOne(userId);
        modifier.$set[options.userId] = user.username;

        var changes = new Array();
        for (var key in originalSet) {
          var value = doc[key];
          if (key.indexOf('.') > -1) {
            var subkeys = key.split('.');
            var value = doc;
            for (var i=0; i<subkeys.length; i=i+1) {
              value = value[subkeys[i]];
            }
          }
          if (originalSet[key] != value) {
            changes.push(key + ": " + originalSet[key]);
          }
        }

        modifier.$set.changes = {'modified': 1, 'modifications': changes};
      }

    });

    /*
     * after update hook
     * */
    collection.after.update(function(userId, doc, fieldNames, modifier, hook_options) {
      // do nothing if special option is set
      if(offOnce) {
        offOnce = false;
        return;
      }
      // do nothing if only ignored fields are modified
      // if(fieldNames.diff(options.ignoredFields).equals([])) return;

      // in case of doc not already versionned
      if(!doc._version) doc._version = 1;

      if (typeof doc.content !== "undefined") {
        var hash = CryptoJS.SHA512(JSON.stringify(doc.content)).toString();
        if (Meteor.isServer) {
          collection.direct.update({_id: doc._id}, {$set: {documentHash: hash}}, {validate: false, getAutoValues: false});
        }
        doc.documentHash = hash;
      }

      copyDoc(doc);

    });

    /*
     * remove hook
     * */
    collection.before.remove(function(userId, doc) {
      // do nothing if special option is set
      if(offOnce) {
        offOnce = false;
        return;
      }
      // in case of doc not already versionned
      if(!doc._version) doc._version = 1;

      // copyDoc(doc); // put last known version in vermongo collection

      // put a dummy version with deleted flag
      doc._version = doc._version + 1;
      if(options['timestamps'])
        doc.modifiedAt = new Date();

      if(doc[options.userId] && options.userId && userId) {
        var user = Meteor.users.findOne(userId);
        doc[options.userId] = user.username;

        doc["changes"] = {'deleted': 1};
      }

      doc._deleted = true;
      copyDoc(doc);
    });

    /*
     * collection helpers
     * */
    collection.helpers({
      versions: function() {
        return _versions_collection.find({ref: this._id}, {sort: {_version: -1}});
      },
      getChanges: function() {
        var changes = new Array();
        versions = _versions_collection.find({ref: this._id}, {sort: {_version: 1}}).fetch();
        for (var version in versions) {
          changes.push({
            'author': versions[version][options.userId],
            'changeset': versions[version].changes,
            'version': versions[version]._version,
            'modifiedAt': versions[version].modifiedAt
          });
        }
        return changes;
      }
    });

    collection.vermongoOffOnce = function() {
      offOnce = true;
    };

    return collection;
  };

  this.getVersionCollection = function() {
    return _versions_collection;
  };

  if(typeof(collection) !== 'undefined' && collection !== null)
    add(collection);

  return collection;
};
