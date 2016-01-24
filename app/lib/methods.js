/*****************************************************************************/
/*  Client and Server Methods */
/*****************************************************************************/

Meteor.methods({

  'proc_desc_xml': function(content) {
    if (Meteor.userId() && Meteor.isServer) {
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
  'sigReq': function(content) {
    if (Meteor.userId() && Meteor.isServer) {
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

      var b = new Buffer(pemBody, 'base64')

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

      var proc_descs2 = ProcDescsVermongo.find({}, {sort: {'modifiedAt': -1}});

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

      return JSON.stringify(output);
    }
  }
});
