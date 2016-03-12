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

    // var fut3 = new Future();
    // var spawn = Npm.require('child_process').spawn;
    // //
    // var command = spawn('/bin/sh', ['-c', 'echo ' + signature.toString('base64') + ' | base64 --decode | openssl pkcs7 -in /dev/stdin -text -inform DER -print_certs']);
    //
    // command.stdout.on('data', function (data) {
    //   fut3.return(data.toString());
    // });
    //
    // command.stderr.on('data', function (data) {
    //   console.log('stderr: ' + data);
    // });
    //
    // var certInfo = fut3.wait();
    // console.log(certInfo);

    /**
     *
     * ToDo: Verify signature with: http://qistoph.blogspot.de/2012/01/manual-verify-pkcs7-signed-data-with.html
     *
     */

    var xmlDocument = new Buffer(create_xml(doc.content), 'utf-8').toString('base64');

    var signatureDigest = hash_file(new Buffer(signature, 'base64'), 'sha256').toUpperCase();
    var xmlDigest = hash_file(new Buffer(xmlDocument, "base64"), 'sha256').toUpperCase();

    var arr = [sentDocumentDigest, signatureDigest, xmlDigest];
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
      timestampResp: timestamp
    };

    var filesId = ProcDescArchiveFiles.insert(archiveFiles);

    var archive = {
      metaData: {
        documentId: documentId,
        documentTitle: serviceShortTitle,
        documentDigest: sentDocumentDigest,
        documentFileName: "Verfahrensbeschreibung.pdf",
        documentFormat: "binary",
        creator: createdBy,
        creationDate: new Date(),
        signatureFileName: "Verfahrensbeschreibung-signatur.pkcs7",
        signatureFormat: "binary",
        signatureDigest: signatureDigest,
        signatureDigestAlgorithm: "SHA256",
        signatureCertFileName: "",
        signatureCertFormat: "binary",
        signatureCertDigest: "",
        signatureCertDigestAlgorithm: "SHA256",
        xmlFileName: "Verfahrensbeschreibung.xml",
        xmlFormat: "utf-8",
        xmlDigest: xmlDigest,
        xmlDigestAlgorithm: "SHA256",
        timestampFileName: "Verfahrensbeschreibung-zeitstempel.tsr",
        timestampFormat: "DER",
        timestampDigest: timestampDigest,
        timestampDigestAlgorithm: "SHA256",
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
