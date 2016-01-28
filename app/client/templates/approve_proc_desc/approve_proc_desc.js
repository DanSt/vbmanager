/*****************************************************************************/
/* ApproveProcDesc: variables */
/*****************************************************************************/

var context = this;

/*****************************************************************************/
/* ApproveProcDesc: Event Handlers */
/*****************************************************************************/
Template.ApproveProcDesc.events({
});

/*****************************************************************************/
/* ApproveProcDesc: Helpers */
/*****************************************************************************/
Template.ApproveProcDesc.helpers({
  getBase64Pdf: function () {
    return context.states.get("originalDocument");
  },
  getReceiveToken: function() {
    return (Math.random()*1e32).toString(36);
  },
  getUserToken: function() {
    var token = localStorage.getItem("Meteor.loginToken");
  }
  // createMerkle: function () {
  //   return ReactiveMethod.call('createMerkle');
  // }
});

/*****************************************************************************/
/* ApproveProcDesc: Lifecycle Hooks */
/*****************************************************************************/
Template.ApproveProcDesc.onCreated(function () {
});

Template.ApproveProcDesc.onRendered(function () {
});

Template.ApproveProcDesc.onDestroyed(function () {
});
