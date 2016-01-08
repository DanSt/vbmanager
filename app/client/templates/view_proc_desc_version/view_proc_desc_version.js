/*****************************************************************************/
/* Id: Event Handlers */
/*****************************************************************************/
Template.ViewProcDescVersion.events({
  'click .return': function(event){
    var originalDocument = this.ref;
    if (!originalDocument) {
      originalDocument = this._id;
    }
    Router.go('/proc_desc/'+originalDocument);
  },
  'click .pdf': function(event) {
    event.preventDefault();

    // alert('Das PDF wird generiert. Bitte haben Sie einen Moment Geduld..');

    window.open(Router.url('generatePDF', {_id: this._id}));
  },
  'click .xml': function() {
    Meteor.call('proc_desc_xml', this.content, function(err, res) {
      if (err) {
        console.error(err);
      } else if (res) {
        var uriContent = "data:text/attachment;charset=UTF-8," + encodeURIComponent(res);
        var myWindow = window.open(uriContent, 'testdocument.xml');
      }
    });
  }
});

/*****************************************************************************/
/* Id: Helpers */
/*****************************************************************************/
Template.ViewProcDescVersion.helpers({
  beforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Wollen Sie wirklich die Verfahrensbeschreibung für "' + doc.serviceShortTitle + '" löschen?')) {
        this.remove();
        Router.go('procDescList');
      }
    };
  },
  isVerified: function (doc) {
    if (doc && CryptoJS.SHA512(JSON.stringify(doc.content)).toString() == doc.documentHash) {
      return "unmodifiziert";
    } else {
      return "wurde modifiziert";
    }
  },
  procDesc: function() {
    return function (collection, id) {
      var doc = collection.findOne(id);
      return doc;
    };
  },
  longDateFormatted: function (date) {
    return moment(date).format("DD.MM.YYYY HH:mm");
  },
  modifierName: function () {
    var user = Meteor.users.findOne(this.modifierId);
    return user && user.profile.lastName + ", " + user.profile.firstName;
  },
  dateFormatted: function (date) {
    return moment(date).format("DD.MM.YYYY");
  },
  contactInfo: function() {
    var contactInfo = ContactInfos.findOne({isDefault: true});
    return contactInfo && contactInfo.content;
  },
  getVersions: function() {
    var originalId = this.ref;
    if (!originalId) {
      originalId = this._id;
    }
    var versions = ProcDescsVermongo.find({ref: originalId}, {sort: {_version: -1}});
    return versions;
  },
  getOriginal: function() {
    var originalId = this.ref;
    if (!originalId) {
      originalId = this._id;
    }
    return ProcDescs.findOne({_id: originalId});
  }
});

/*****************************************************************************/
/* Id: Lifecycle Hooks */
/*****************************************************************************/
Template.ViewProcDescVersion.onCreated(function () {
});

Template.ViewProcDescVersion.onRendered(function () {
});

Template.ViewProcDescVersion.onDestroyed(function () {
});
