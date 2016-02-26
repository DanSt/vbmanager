/*****************************************************************************/
/* ProcDescList: Event Handlers */
/*****************************************************************************/
Template.ProcDescListSingle.events({
  'click .delete': function () {
    var doc = ProcDescs.findOne(this._id);
    var id = this._id
    if (typeof doc === "undefined") {
      doc = ProcDescsVermongo.findOne(this._id);
      id = doc.ref;
    }
    if (confirm('Wollen Sie wirklich die Verfahrensbeschreibung für "' + doc.content.serviceShortTitle + '" löschen?')) {
      ProcDescs.remove(id);
    }
  },
  'click .pdf': function () {
    window.open(Router.url('generatePDF', {_id: this._id}));
  },
  'click .xml': function() {
    Meteor.call('proc_desc_xml', this.content, function(err, res) {
      if (err) {
        console.error(err);
      } else if (res) {
        var uriContent = "data:text/attachment;charset=UTF-8," + encodeURIComponent(res);
        window.open(uriContent, 'testdocument.xml');
      }
    });
  }
});

Template.ProcDescList.helpers({
  approved_proc_descs: function () {
    var ids = _.uniq(_.pluck(ProcDescs.find({}, {sort: {modifiedAt: -1}, fields: {_id: 1}}).fetch(), '_id'));
    var values = [];
    for (var key in ids) {
      var value = ProcDescsVermongo.find({"content.approved": true, ref: ids[key]}, {sort: {"content.approvedAt": -1}, limit: 1}).fetch();
      if (value.length > 0) {
        values.push(value[0]);
      }
    }
    return values;
  },
  proc_descs: function () {
    return ProcDescs.find({}, {sort: {modifiedAt: -1}});
  }
});
/*****************************************************************************/
/* ProcDescList: Helpers */
/*****************************************************************************/
Template.ProcDescListSingle.helpers({
  longDateFormatted: function (date) {
    return moment(date).format("DD.MM.YYYY HH:mm");
  },

  beforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Wollen Sie wirklich die Verfahrensbeschreibung für "' + doc.content.serviceShortTitle + '" löschen?')) {
        this.remove();
        Router.go('procDescList');
      }
    };
  }
});

/*****************************************************************************/
/* ProcDescList: Lifecycle Hooks */
/*****************************************************************************/
Template.ProcDescList.onCreated(function () {
});

Template.ProcDescList.onRendered(function () {
});

Template.ProcDescList.onDestroyed(function () {
});
