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
    var pdf = "";
    if (this.archive && this.archive.files && this.archive.files.originalDocument) {
      pdf = this.archive.files.originalDocument;
    } else {
      pdf = Meteor.call('proc_desc_pdf', Meteor.userId(), localStorage.getItem("Meteor.loginToken"), this._id);
    }
    // var pdf = context.states.get("originalDocument");
    return pdf;
  },
  getDocumentId: function() {
    var documentId = this._id;
    // var documentId = context.states.get("documentId");
    return documentId;
  },
  getUserToken: function() {
    return localStorage.getItem("Meteor.loginToken");
  },
  getUrl: function() {
    var url = Meteor.absoluteUrl();
    return url;
  },
  getCreatedBy: function() {
    // return context.states.get("createdBy");
    return this.content.sectionA.createdBy;
  },
  getServiceShortTitle: function() {
    // return context.states.get("serviceShortTitle");
    return this.content.serviceShortTitle;
  },
  getVersion: function() {
    // return context.states.get("version");
    return this._version;
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
