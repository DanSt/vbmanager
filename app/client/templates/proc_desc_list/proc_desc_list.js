/*****************************************************************************/
/* ProcDescList: Event Handlers */
/*****************************************************************************/
Template.ProcDescList.events({
  'click .delete': function () {
    var doc = ProcDescs.findOne(this._id);
    if (confirm('Wollen Sie wirklich die Verfahrensbeschreibung für "' + doc.content.serviceShortTitle + '" löschen?')) {
      ProcDescs.remove(this._id);
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

/*****************************************************************************/
/* ProcDescList: Helpers */
/*****************************************************************************/
Template.ProcDescList.helpers({
  proc_descs: function () {
    return ProcDescs.find({}, {sort: {modifiedAt: -1}});
  },

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
