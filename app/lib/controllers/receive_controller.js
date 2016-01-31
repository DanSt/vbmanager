(function(){ReceiveController = RouteController.extend({

  // A place to put your subscriptions
  // this.subscribe('items');
  // // add the subscription to the waitlist
  // this.subscribe('item', this.params._id).wait();

  subscriptions: function() {
    this.subscribe('proc_descs', Meteor.userId());
  },

  // Subscriptions or other things we want to "wait" on. This also
  // automatically uses the loading hook. That's the only difference between
  // this option and the subscriptions option above.
  // return Meteor.subscribe('post', this.params._id);

  receiveSigned: function () {
    var userToken = this.request.body.userToken;
    var userId = this.request.body.userId;
    var documentId = this.request.body.documentId;
    var signature = this.request.body.Signature;
    var originalDocument = this.request.body.SignedData;
    var serviceShortTitle = this.request.body.serviceShortTitle;
    var createdBy = this.request.body.createdBy;
    var version = this.request.body.version;

    var user = Meteor.users.findOne({
      _id: userId,
      'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(userToken)
    });

    //If they're not logged in tell them
    if (!user) {
      this.route('proc_desc_list');
    }

    var updateSet = {
      "content.approved": true,
      "archive.metaData.documentId": documentId,
      "archive.metaData.documentTitle": serviceShortTitle,
      "archive.metaData.creator": createdBy,
      "archive.metaData.creationDate": new Date(),
      "archive.metaData.documentFileName": "verfahrensbeschreibung.pdf",
      "archive.metaData.documentFormat": "base64",
      "archive.metaData.documentDigest": CryptoJS.SHA256(originalDocument).toString(),
      "archive.metaData.documentDigestAlgorithm": "SHA256",
      "archive.metaData.signatureFileName": "verfahrensbeschreibung-signatur.pkcs7",
      "archive.metaData.signatureFormat": "base64",
      "archive.metaData.signatureDigest": CryptoJS.SHA256(signature).toString(),
      "archive.metaData.signatureDigestAlgorithm": "SHA256",
      "archive.metaData.signatureCertFileName": "",
      "archive.metaData.signatureCertFormat": "base64",
      "archive.metaData.signatureCertDigest": "",
      "archive.metaData.signatureCertDigestAlgorithm": "SHA256",
      "archive.metaData.versionNumber": version,
      "archive.files.originalDocument": originalDocument,
      "archive.files.signature": signature
    };

    // var updateSet = {
    //   approved: true,
    //   archive: {
    //     metaData: {
    //       documentId: documentId,
    //       documentTitle: serviceShortTitle,
    //       creator: createdBy,
    //       creationDate: new Date(),
    //       documentFileName: "verfahrensbeschreibung.pdf",
    //       documentFormat: "base64",
    //       documentDigest: CryptoJS.SHA256(originalDocument).toString(),
    //       documentDigestAlgorithm: "SHA256",
    //       signatureFileName: "verfahrensbeschreibung-signatur.pdf",
    //       signatureFormat: "base64",
    //       signatureDigest: CryptoJS.SHA256(signature).toString(),
    //       signatureDigestAlgorithm: "SHA256",
    //       signatureCertFileName: "",
    //       signatureCertFormat: "base64",
    //       signatureCertDigest: "",
    //       signatureCertDigestAlgorithm: "SHA256",
    //       versionNumber: version,
    //     },
    //     files: {
    //       originalDocument: originalDocument,
    //       signature: signature
    //     }
    //   }
    // };

    ProcDescs.update({_id: documentId}, {$set: updateSet}, {getAutoValues: false}, function(error, affectedDocs) {
      if (error) {
          console.log(error.message);
      } else {
          console.log("Success");
          console.log(JSON.stringify(affectedDocs));
      }
    });

    this.response.writeHead(200);
    this.response.end();
  }

});

}).call(this);
