(function(){ReceiveController = RouteController.extend({

  // A place to put your subscriptions
  // this.subscribe('items');
  // // add the subscription to the waitlist
  // this.subscribe('item', this.params._id).wait();

  subscriptions: function() {
    this.subscribe('proc_descs');
  },

  // Subscriptions or other things we want to "wait" on. This also
  // automatically uses the loading hook. That's the only difference between
  // this option and the subscriptions option above.
  // return Meteor.subscribe('post', this.params._id);

  receiveSigned: function () {
    var userToken = this.request.body.userToken;
    var userId = this.request.body.userId;
    var documentId = this.request.body.documentId;
    var originalDocument = this.request.body.SignedData;
    var signature = this.request.body.Signature;
    var serviceShortTitle = this.request.body.serviceShortTitle;
    var createdBy = this.request.body.createdBy;
    var version = this.request.body.version;

    var user = Meteor.users.findOne({
      _id: userId,
      'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(userToken)
    });

    //If they're not logged in tell them
    if (!user || Roles.userIsInRole('datenschutzBeauftragter')) {
      this.response.writeHead(401);
      this.response.end();
    } else {
      this.response.writeHead(200);
      this.response.end();
    }

    var archiveFiles = {
      signature: signature,
      originalDocument: originalDocument
    };

    var filesId = ProcDescArchiveFiles.insert(archiveFiles);

    var hash_file = Meteor.npmRequire('hash_file');
    var merkle = Meteor.npmRequire('merkle');
    var merkle_mod = Meteor.npmRequire('merkle-tree');

    var documentDigest = hash_file(new Buffer(originalDocument, 'base64'), 'sha256');
    var signatureDigest = hash_file(new Buffer(signature, 'base64'), 'sha256');

    var arr = [documentDigest, signatureDigest];
    var tree = merkle('sha256').sync(arr);

    var treeStructure = [];
    for (var i=0; i<tree.levels(); i++) {
      treeStructure.push(tree.level(i));
    }

    var updateSet = {
      "content.approved": true,
      "content.approvedAt": new Date(),
      "archive.metaData.documentId": documentId,
      "archive.metaData.documentTitle": serviceShortTitle,
      "archive.metaData.documentDigest": documentDigest,
      "archive.metaData.documentFileName": "Verfahrensbeschreibung.pdf",
      "archive.metaData.documentFormat": "binary",
      "archive.metaData.documentDigestAlgorithm": "SHA256",
      "archive.metaData.creator": createdBy,
      "archive.metaData.creationDate": new Date(),
      "archive.metaData.signatureFileName": "Verfahrensbeschreibung-signatur.pkcs7",
      "archive.metaData.signatureFormat": "binary",
      "archive.metaData.signatureDigest": signatureDigest,
      "archive.metaData.signatureDigestAlgorithm": "SHA256",
      "archive.metaData.signatureCertFileName": "",
      "archive.metaData.signatureCertFormat": "base64",
      "archive.metaData.signatureCertDigest": "",
      "archive.metaData.signatureCertDigestAlgorithm": "SHA256",
      "archive.metaData.versionNumber": version,
      "archive.metaData.merkleTree": JSON.stringify(treeStructure),
      "archive.metaData.merkleRootHash": treeStructure[0][0],
      "archive.files": filesId
    };

    ProcDescs.update({_id: documentId}, {$set: updateSet}, {getAutoValues: false});
  }

});

}).call(this);
