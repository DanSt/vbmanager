/*****************************************************************************/
/* Id: Event Handlers */
/*****************************************************************************/
Template.EditProcDesc.events({
  'submit form': function(event){
    /*alert('Die Verfahrensbeschreibung wurde gespeichert.');*/
    Router.go('procDescList');
  },
  'click .cancel': function(event){
    /*alert('Die Verfahrensbeschreibung wurde gespeichert.');*/
    Router.go('procDescList');
  },
});

/*****************************************************************************/
/* Id: Helpers */
/*****************************************************************************/
Template.EditProcDesc.helpers({
  beforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Wollen Sie wirklich die Verfahrensbeschreibung für "' + doc.serviceShortTitle + '" löschen?')) {
        this.remove();
        Router.go('procDescList');
      }
    };
  }
});

/*****************************************************************************/
/* Id: Lifecycle Hooks */
/*****************************************************************************/
Template.EditProcDesc.onCreated(function () {
});

Template.EditProcDesc.onRendered(function () {
});

Template.EditProcDesc.onDestroyed(function () {
});
