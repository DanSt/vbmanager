/*****************************************************************************/
/* ProcDescList: Event Handlers */
/*****************************************************************************/
Template.ProcDescList.events({
  'click .delete': function () {
    var doc = ProcDescs.findOne(this._id);
    if (confirm('Wollen Sie wirklich die Verfahrensbeschreibung für "' + doc.serviceShortTitle + '" löschen?')) {
      ProcDescs.remove(this._id);
    }
  },
  'click .pdf': function () {
    window.open(Router.url('generatePDF', {_id: this._id}));
  }
});

/*****************************************************************************/
/* ProcDescList: Helpers */
/*****************************************************************************/
Template.ProcDescList.helpers({
  proc_descs: function () {
    return ProcDescs.find();
  },

  modificationDateFormatted: function () {
    return moment(this.modifiedAt).format("DD.MM.YYYY HH:mm");
  },

  beforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Wollen Sie wirklich die Verfahrensbeschreibung für "' + doc.serviceShortTitle + '" löschen?')) {
        this.remove();
        Router.go('procDescList');
      }
    };
  },
  modifierName: function () {
    var user = Meteor.users.findOne(this.modifierId);
    return user && user.profile.lastName + ", " + user.profile.firstName;
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
