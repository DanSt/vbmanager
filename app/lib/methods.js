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
      // var decodedString = b.toString();

      HTTP.call("POST", "http://zeitstempel.dfn.de", {headers: {'Content-Type': 'application/timestamp-query'}, content: b}, function(error, result) {
        fut.return(result);
      });

      var result = fut.wait();

      return new Buffer(result.content).toString('base64');
    }
  }
});
