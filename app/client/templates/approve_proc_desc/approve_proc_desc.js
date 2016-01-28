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
    var pdf = context.states.get("originalDocument");
    return pdf;
  },
  getReceiveToken: function() {
    return (Math.random()*1e32).toString(36);
  },
  getUserToken: function() {
    return localStorage.getItem("Meteor.loginToken");
  },
  getUrl: function() {
    var url = Meteor.absoluteUrl();
    return url;
  }
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
