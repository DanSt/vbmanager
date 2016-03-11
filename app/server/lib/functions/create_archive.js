create_archive = function(doc) {
  var files = ProcDescArchiveFiles.find({_id: doc.archive.files}).fetch()[0];

  var XML = Meteor.npmRequire('simplexml');
  moment.locale('de');

  var xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  doc.archive.metaData.creationDate = moment(doc.archive.metaData.creationDate).format('DD.MM.YYYY');

  var JSZip = Meteor.npmRequire('jszip');
  var zip = new JSZip();

  // var metaXML = xmlHeader + '<metaData>' + XML.stringify(doc.archive.metaData) + '</metaData>';
  var metaXML = XML.toXML(doc.archive.metaData, {manifest: true, root: 'metaData'});

  zip.file(doc.archive.metaData.documentFileName, files.originalDocument, {base64: true});
  zip.file(doc.archive.metaData.signatureFileName, files.signature, {base64: true});
  zip.file(doc.archive.metaData.timestampFileName, files.timestampResp, {base64: true});
  zip.file(doc.archive.metaData.xmlFileName, files.xmlDocument, {base64: true});
  zip.file('MetaDaten.xml', metaXML);

  var base64Zip = zip.generate({type: 'base64'});

  return base64Zip;
}
