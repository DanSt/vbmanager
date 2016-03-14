create_changes_xml = function(changes){
  var XML = Meteor.npmRequire('simplexml');
  // var xmlDocument = xmlHeader + '<document>' + XML.stringify(content) + '</document>';
  var xmlDocument = XML.toXML(changes, {manifest: true, root: 'changes'});

  return xmlDocument;
}
