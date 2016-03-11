create_pdf = function(data) {
  var files = {};
  if (data.archive && data.archive.files) {
    files = ProcDescArchiveFiles.find({_id: data.archive.files}).fetch()[0];
    return files.originalDocument;
  }

  var webshot = Meteor.npmRequire('webshot');
  var fs      = Npm.require('fs');

  var fut = new Future();

  var fileName = "verfahrensbeschreibung.pdf";

  var css = Assets.getText('style.css');

  SSR.compileTemplate('layout', Assets.getText('layout.html'));
  SSR.compileTemplate('proc_view', Assets.getText('procview.html'));

  Template.layout.helpers({
    getDocType: function() {
      return "<!DOCTYPE html>";
    }
  });

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

  var options = {
      "paperSize": {
          "format": "A4",
          "orientation": "portrait",
          "margin": "2cm"
      },
      siteType: 'html'
  };

  webshot(html_string, fileName, options, function(err) {
    fs.readFile(fileName, function (err, data) {
        fs.unlinkSync(fileName);
        fut.return(data);
    });
  });

  var pdfData = fut.wait();
  var base64Pdf = new Buffer(pdfData).toString('base64');

  return base64Pdf;
}
