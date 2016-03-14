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
    var sentDocument = this.request.body.SignedData;
    var signature = this.request.body.Signature;
    var serviceShortTitle = this.request.body.serviceShortTitle;
    var createdBy = this.request.body.createdBy;
    var version = this.request.body.version;

    var user = Meteor.users.findOne({
      _id: userId,
      'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(userToken)
    });

    var hash_file = Meteor.npmRequire('hash_file');
    var merkle = Meteor.npmRequire('merkle');
    var merkle_mod = Meteor.npmRequire('merkle-tree');

    var doc = ProcDescs.find({_id: documentId}).fetch()[0];

    var sentDocumentDigest = hash_file(new Buffer(sentDocument, 'base64'), 'sha256').toUpperCase();

    // if no logged in user can be found or if the document has been changed since starting the approval
    // stop here
    if (typeof doc === "undefined" || typeof doc.archive === "undefined" ||
      typeof doc.archive.metaData === "undefined" || doc.archive.metaData.documentDigest != sentDocumentDigest ||
      doc._version != version || !user || !Roles.userIsInRole(user._id, 'datenschutzBeauftragter')) {

      this.response.writeHead(401);
      this.response.end();
      return;

    } else {

      this.response.writeHead(200);
      this.response.end();

    }

    // var certs = print_certs(signature);
    // console.log(certs);

    /**
     *
     * ToDo: Verify signature with: http://qistoph.blogspot.de/2012/01/manual-verify-pkcs7-signed-data-with.html
     *
     */

    var docChanges = doc.getChanges();
    var newChanges = {
      modified: 1,
      modifications: {
        content: {
          approved: true,
          approvedAt: new Date()
        }
      }
    };
    docChanges.push({
      author: user.username,
      changes: newChanges,
      modifiedAt: new Date()
    });

    var changesFile = new Buffer(create_changes_xml(docChanges), 'utf-8').toString('base64');

    var xmlDocument = new Buffer(create_document_xml(doc.content), 'utf-8').toString('base64');

    var signatureDigest = hash_file(new Buffer(signature, 'base64'), 'sha256').toUpperCase();
    var changesDigest = hash_file(new Buffer(changesFile, 'base64'), 'sha256').toUpperCase();
    var xmlDigest = hash_file(new Buffer(xmlDocument, "base64"), 'sha256').toUpperCase();

    var arr = [sentDocumentDigest, changesDigest, signatureDigest, xmlDigest];
    var tree = merkle('sha256', true).sync(arr);

    var treeStructure = [];
    for (var i=0; i<tree.levels(); i++) {
      treeStructure.push(tree.level(i));
    }

    var timestamp = Meteor.call('sigReq', treeStructure[0][0], userId, userToken);
    var timestampDigest = hash_file(new Buffer(timestamp, 'base64'), 'sha256');

    var archiveFiles = {
      signature: signature,
      originalDocument: sentDocument,
      xmlDocument: xmlDocument,
      changes: changesFile,
      timestampResp: timestamp
    };

    var filesId = ProcDescArchiveFiles.insert(archiveFiles);

    var archive = {
      metaData: {
        documentId: documentId,
        documentTitle: serviceShortTitle,
        documentFileName: "Verfahrensbeschreibung.pdf",
        documentFormat: "binary",
        documentDigest: sentDocumentDigest,
        documentDigestAlgorithm: "SHA256",
        changesFileName: "Verfahrensbeschreibung-modifikationen.xml",
        changesFormat: "XML",
        changesDigest: changesDigest,
        changesDigestAlgorithm: "SHA256",
        author: createdBy,
        creationDate: new Date(),
        signatureFileName: "Verfahrensbeschreibung-signatur.pkcs7",
        signatureFormat: "binary",
        signatureDigest: signatureDigest,
        signatureDigestAlgorithm: "SHA256",
        signatureRootCertFileName: "",
        signatureRootCertFormat: "DER",
        signatureRootCertDigest: "",
        signatureRootCertDigestAlgorithm: "SHA256",
        xmlFileName: "Verfahrensbeschreibung.xml",
        xmlFormat: "utf-8",
        xmlDigest: xmlDigest,
        xmlDigestAlgorithm: "SHA256",
        timestampFileName: "Verfahrensbeschreibung-zeitstempel.tsr",
        timestampFormat: "DER",
        timestampDigest: timestampDigest,
        timestampDigestAlgorithm: "SHA256",
        timestampRootCertFileName: "",
        timestampRootCertFormat: "DER",
        timestampRootCertDigest: "",
        timestampRootCertDigestAlgorithm: "SHA256",
        versionNumber: version,
        merkleTree: JSON.stringify(treeStructure),
        merkleRootHash: treeStructure[0][0]
      },
      files: filesId
    }

    var updateSet = {
      "content.approved": true,
      "content.approvedAt": newChanges.modifications.content.approvedAt,
      "modifierId": user.username,
      "archive": archive
    }

    // add changes for approval
    updateSet["changes"] = {
      content: {
        approved: updateSet["content.approved"],
        approvedAt: updateSet["content.approvedAt"]
      }
    };

    var success = write_archive(archive);

    if (success) {
      ProcDescs.update({_id: documentId}, {$set: updateSet}, {getAutoValues: false, filter: false, validate: false}, function(error, result) {
        if (error) {
          console.log(error);
        }
        if (result) {
          update_tree();
        }
      });
    }
  }

});

}).call(this);
