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
    // var user_id = Meteor.userId();
    // var token = localStorage.getItem("Meteor.loginToken");
    //
    // if (this.archive && this.archive.files && this.archive.files.originalDocument) {
    //   return this.archive.files.originalDocument;
    // }
    //
    // var generatedPDF = Meteor.call('proc_desc_pdf', user_id, token, this._id);

    var generatedPDF = context.states.get("originalDocument");
    console.log(generatedPDF);

    return generatedPDF;
  },
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
