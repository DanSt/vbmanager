/*****************************************************************************/
/* Id: Event Handlers */
/*****************************************************************************/
Template.ViewProcDescVersion.events({
  'click .return': function(event){
    var originalDocument = this.ref;
    Router.go('/proc_desc/'+originalDocument);
  },
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
  procDesc: function() {
    return function (collection, id) {
      var doc = collection.findOne(id);
      return doc;
    };
  },
  modificationDateFormatted: function () {
    return moment(this.modifiedAt).format("DD.MM.YYYY HH:mm");
  },
  modifierName: function () {
    var user = Meteor.users.findOne(this.modifierId);
    return user.profile.lastName + ", " + user.profile.firstName;
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
