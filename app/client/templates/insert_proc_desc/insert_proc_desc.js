/*****************************************************************************/
/* InsertProcDesc: Event Handlers */
/*****************************************************************************/
Template.InsertProcDesc.events({
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
/* InsertProcDesc: Helpers */
/*****************************************************************************/
Template.InsertProcDesc.helpers({
  currentDate: function() {
    var date = new Date();
    moment.lang('de');
    return moment(date).format('DD.MM.YYYY');
  }
});

/*****************************************************************************/
/* InsertProcDesc: Lifecycle Hooks */
/*****************************************************************************/
Template.InsertProcDesc.onCreated(function () {
});

Template.InsertProcDesc.onRendered(function () {
});

Template.InsertProcDesc.onDestroyed(function () {
});
