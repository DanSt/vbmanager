/*****************************************************************************/
/*  Client and Server Methods */
/*****************************************************************************/

Meteor.methods({
  'proc_desc_generate': function(doc) {

    if (Meteor.isServer) {
      var webshot = Meteor.npmRequire('webshot');
      var fs      = Npm.require('fs');
      var Future = Npm.require('fibers/future');

      var fut = new Future();

      var fileName = "verfahrensbeschreibung.pdf";

      // GENERATE HTML STRING
      var css = Assets.getText('style.css') + Assets.getText('bootstrap.min.css') + Assets.getText('font-awesome.min.css');

      SSR.compileTemplate('layout', Assets.getText('layout.html'));

      Template.layout.helpers({
        getDocType: function() {
          return "<!DOCTYPE html>";
        }
      });

      SSR.compileTemplate('proc_view', Assets.getText('procview.html'));

      // PREPARE DATA
      // var data = ProcDescs.findOne({id: _id});
      var data = doc;

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
      var base64String = new Buffer(pdfData).toString('base64');

      return base64String;
    }
  }
});
