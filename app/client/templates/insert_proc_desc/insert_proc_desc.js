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
    moment.locale('de');
    return moment(new Date()).format('DD.MM.YYYY');
  },
  contactInfo: function() {
    var contactInfo = ContactInfos.findOne({isDefault: true});
    return contactInfo && contactInfo.content;
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
