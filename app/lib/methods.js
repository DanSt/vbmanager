/*****************************************************************************/
/*  Client and Server Methods */
/*****************************************************************************/

Meteor.methods({

  'proc_desc_xml': function(content) {
    if (Meteor.userId() && Meteor.isServer && Roles.userIsInRole(Meteor.userId(), ['datenschutzBeauftragter'])) {
      var XML = Meteor.npmRequire('simple-xml');
      moment.locale('de');

      var xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
      content.sectionA.creationDate = moment(content.sectionA.creationDate).format('DD.MM.YYYY');
      if (content.sectionA.documentPurposeOriginalDate) {
        content.sectionA.documentPurposeOriginalDate = moment(content.sectionA.documentPurposeOriginalDate).format('DD.MM.YYYY');
      }
      var xmlDocument = xmlHeader + XML.stringify(content);

      return xmlDocument;
    }
  },
  'proc_desc_pdf': function(userid, token, id) {
    if (Meteor.isServer) {

      /**
      *   Solution from http://stackoverflow.com/questions/27734110/authentication-on-server-side-routes-in-meteor
      **/
      //Check a valid user with this token exists

      if (typeof id === 'undefined') {
        return "";
      }

      var user = Meteor.users.findOne({
        _id: userid,
        'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(token)
      });

      // PREPARE DATA
      var mainId = id;
      var data = ProcDescs.find({_id: id}).fetch()[0];
      var collection = ProcDescs;
      if (typeof data === 'undefined') {
        data = ProcDescsVermongo.find({_id: id}).fetch()[0];
        mainId = data.ref;
        collection = ProcDescsVermongo;
      }

      if (!user || !Roles.userIsInRole(user._id, ['datenschutzBeauftragter']) && !Roles.userIsInRole(user._id, mainId)) {
        return "";
      }

      var pdf = "";

      var files = {};
      if (data.archive && data.archive.files) {
        files = ProcDescArchiveFiles.find({_id: data.archive.files}).fetch()[0];
        return files.originalDocument;
      }

      var webshot = Meteor.npmRequire('webshot');
      var fs      = Npm.require('fs');
      var Future = Npm.require('fibers/future');

      var fut = new Future();

      var fileName = "verfahrensbeschreibung.pdf";

      // GENERATE HTML STRING
      var css = Assets.getText('style.css');

      SSR.compileTemplate('layout', Assets.getText('layout.html'));

      Template.layout.helpers({
        getDocType: function() {
          return "<!DOCTYPE html>";
        }
      });

      SSR.compileTemplate('proc_view', Assets.getText('procview.html'));

      Template.proc_view.helpers({
        dateFormatted: function (date) {
          return moment(date).format("DD.MM.YYYY");
        },
        contactInfo: function() {
          var contactInfo = ContactInfos.findOne({isDefault: true});
          return contactInfo && contactInfo.content;
        }
      });

      var html_string = SSR.render('layout', {
        css: css,
        template: "proc_view",
        data: data
      });

      // Setup Webshot options
      var options = {
          "paperSize": {
              "format": "A4",
              "orientation": "portrait",
              "margin": "2cm"
          },
          siteType: 'html'
      };

      // Commence Webshot
      console.log("Commencing webshot...");
      webshot(html_string, fileName, options, function(err) {
        fs.readFile(fileName, function (err, data) {
            if (err) {
                return console.log(err);
            }

            fs.unlinkSync(fileName);
            fut.return(data);

        });
      });

      var pdfData = fut.wait();
      var base64Pdf = new Buffer(pdfData).toString('base64');

      return base64Pdf;
    }
  },
  'proc_desc_archive': function(userid, token, id) {

    /**
    *   Solution from http://stackoverflow.com/questions/27734110/authentication-on-server-side-routes-in-meteor
    **/
    //Check a valid user with this token exists
    var user = Meteor.users.findOne({
      _id: userid,
      'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(token)
    });

    // PREPARE DATA
    var mainId = id;
    var doc = ProcDescs.find(id).fetch()[0];
    var collection = ProcDescs;
    if (typeof doc === 'undefined') {
      doc = ProcDescsVermongo.find({_id: id}).fetch()[0];
      mainId = doc.ref;
      collection = ProcDescsVermongo;
    }

    if (!doc.content.approved || !user || !Roles.userIsInRole(user._id, ['datenschutzBeauftragter']) && !Roles.userIsInRole(user._id, mainId)) {
      return "";
    }

    var XML = Meteor.npmRequire('simple-xml');
    moment.locale('de');

    var xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
    doc.archive.metaData.creationDate = moment(doc.archive.metaData.creationDate).format('DD.MM.YYYY');

    var AdmZip = Meteor.npmRequire('adm-zip');
    var zip = new AdmZip();

    var mainDoc = new Buffer(doc.archive.files.originalDocument, 'base64');
    var signature = new Buffer(doc.archive.files.signature, 'base64');
    var metaXML = new Buffer(xmlHeader + XML.stringify(doc.archive.metaData));

    zip.addFile(doc.archive.metaData.documentFileName, mainDoc);
    zip.addFile(doc.archive.metaData.signatureFileName, signature);
    zip.addFile('MetaDaten.xml', metaXML);

    var base64Zip = zip.toBuffer().toString('base64');

    return base64Zip;
  },
  'sigReq': function(content) {
    if (Meteor.userId() && Meteor.isServer && Roles.userIsInRole(Meteor.userId(), ['datenschutzBeauftragter'])) {
      var jsrsasign = Meteor.npmRequire('jsrsasign');
      var fs      = Npm.require('fs');
      var Future = Npm.require('fibers/future');
      var fut = new Future();
      var httpreq = Meteor.npmRequire('httpreq');

      var hashValue = CryptoJS.SHA256(content).toString();

      var json = {
        mi: { hashAlg: 'sha256',
              hashValue: hashValue }
      };

      json.certreq = true;

      var o = new jsrsasign.asn1.tsp.TimeStampReq(json);
      var hex = o.getEncodedHex();
      var b64 = jsrsasign.hex2b64(hex);
      var pemBody = b64.replace(/(.{64})/g, "$1\r\n");
      pemBody = pemBody.replace(/\r\n$/, '');

      var b = new Buffer(pemBody, 'base64');

      httpreq.post('http://zeitstempel.dfn.de', {headers: {'Content-Type': 'application/timestamp-query'}, binary: true, body: b}, function (err, res) {
        if (err) {
          console.log(err);
        } else {
          fut.return(res);
        }
      });

      var binaryResult = fut.wait();
      /**
       *  return entire response as base64
       */
      // return binaryResult.toString('base64');

      var fut2 = new Future();
      /**
       *  Doesn't work in production environment because simple pipe of spawn does not work to pipe input.
       *  Must be done manually like in example a bit lower with spawn.
       */
      // openssl.exec('ts', binaryResult.body, {reply: true, in: '/dev/stdin', text: true}, function(err, buffer) {
      //   if (err) {
      //     console.log(err);
      //   }
      //   fut2.return(buffer.toString());
      // });

      var spawn = Npm.require('child_process').spawn;

      var command = spawn('/bin/sh', ['-c', 'echo ' + binaryResult.body.toString('base64') + ' | base64 --decode | openssl ts -reply -in /dev/stdin -text']);

      command.stdout.on('data', function (data) {
        fut2.return(data.toString());
      });

      command.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
      });

      var timestampInfo = fut2.wait();

      /**
       *  Convert into ASNstructure and base64
       */
      // // Convert from binary DER to hexadecimal DER
      // var hexResult = binaryResult.body.toString('hex');
      // // Convert from hexadecimally represented DER to ASN1
      // var ASN1Result = jsrsasign.ASN1HEX.dump(hexResult);
      // // Convert to Base64
      // var buffer = new Buffer(ASN1Result);
      // var base64Result = buffer.toString('base64');

      return timestampInfo;
    }
  },
  'createMerkle': function() {
    if(Meteor.userId() && Meteor.isServer) {
      var merkle = Meteor.npmRequire('merkle');
      var merkle_mod = Meteor.npmRequire('merkle-tree');

      // var proc_descs2 = ProcDescsVermongo.find({"modifiedAt" : { $lte : new Date("2016-01-23T20:15:31Z") }}, {sort: {'modifiedAt': -1}});
      var proc_descs2 = ProcDescsVermongo.find({}, {fields: {'archive.files': 0}, sort: {'modifiedAt': -1}}).fetch();

      var arr = [];

      proc_descs2.forEach(function(item) {
        if (item._id && item.documentHash) {
          arr.push(item.documentHash);
        }
      });

      var tree = merkle('sha256').sync(arr);

      var output = [];
      for (var i=0; i<tree.levels(); i++) {
        output.push(tree.level(i));
      }

      return output;
    }
  }
});
