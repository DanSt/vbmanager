create_xml = function(content) {
  var XML = Meteor.npmRequire('simplexml');
  moment.locale('de');

  content.sectionA.creationDate = moment(content.sectionA.creationDate).format('DD.MM.YYYY');
  if (typeof content.sectionA.documentPurposeOriginalDate !== "undefined") {
    content.sectionA.documentPurposeOriginalDate = moment(content.sectionA.documentPurposeOriginalDate).format('DD.MM.YYYY');
  }
  if (typeof content.approvedAt !== "undefined") {
    content.approvedAt = moment(content.approvedAt).format('DD.MM.YYYY');
  }
  // var xmlDocument = xmlHeader + '<document>' + XML.stringify(content) + '</document>';
  var xmlDocument = XML.toXML(content, {manifest: true, root: 'document'});

  return xmlDocument;
}
