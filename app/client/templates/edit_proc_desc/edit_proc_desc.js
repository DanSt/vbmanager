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
  },
  isVerified: function () {
    if (CryptoJS.SHA512(JSON.stringify(this.content)).toString() == this.documentHash) {
      return "unmodifiziert";
    } else {
      return "wurde modifiziert";
    }
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
