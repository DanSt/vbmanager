/*****************************************************************************/
/*  Client and Server Methods */
/*****************************************************************************/

Meteor.methods({

  'proc_desc_xml': function(content) {
    if (Meteor.userId() && Meteor.isServer) {
      var webshot = Meteor.npmRequire('webshot');
      var XML = Meteor.npmRequire('simple-xml');
      var xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
      var xmlFooter = '</xml>'
      var xmlDocument = xmlHeader + XML.stringify(content) + xmlFooter;

      return xmlDocument;
    }
  }
});
