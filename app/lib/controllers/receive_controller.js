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
      return;
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

    var archive = {
      metaData: {
        documentId: documentId,
        documentTitle: serviceShortTitle,
        documentDigest: documentDigest,
        documentFileName: "Verfahrensbeschreibung.pdf",
        documentFormat: "binary",
        creator: createdBy,
        creationDate: new Date(),
        signatureFileName: "Verfahrensbeschreibung-signatur.pkcs7",
        signatureFormat: "binary",
        signatureDigest: signatureDigest,
        signatureDigestAlgorithm: "SHA256",
        signatureCertFileName: "",
        signatureCertFormat: "base64",
        signatureCertDigest: "",
        signatureCertDigestAlgorithm: "SHA256",
        versionNumber: version,
        merkleTree: JSON.stringify(treeStructure),
        merkleRootHash: treeStructure[0][0]
      },
      files: filesId
    }

    var updateSet = {
      "content.approved": true,
      "content.approvedAt": new Date(),
      "modifierId": userId,
      "archive": archive
    }

    ProcDescs.update({_id: documentId}, {$set: updateSet}, {getAutoValues: false, filter: false});
  }

});

}).call(this);
