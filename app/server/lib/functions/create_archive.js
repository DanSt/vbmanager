create_archive = function(archive) {
  var files = ProcDescArchiveFiles.find({_id: archive.files}).fetch()[0];

  var XML = Meteor.npmRequire('simplexml');

  archive.metaData.creationDate = moment(archive.metaData.creationDate).format("DD.MM.YYYY");

  var JSZip = Meteor.npmRequire('jszip');
  var zip = new JSZip();

  var metaXML = XML.toXML(archive.metaData, {manifest: true, root: 'metaData'});

  zip.file(archive.metaData.documentFileName, files.originalDocument, {base64: true});
  zip.file(archive.metaData.signatureFileName, files.signature, {base64: true});
  zip.file(archive.metaData.timestampFileName, files.timestampResp, {base64: true});
  zip.file(archive.metaData.xmlFileName, files.xmlDocument, {base64: true});
  zip.file('MetaDaten.xml', metaXML);

  var base64Zip = zip.generate({type: 'base64'});

  return base64Zip;
}
