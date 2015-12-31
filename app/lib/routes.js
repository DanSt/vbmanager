Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  action: 'action',
  where: 'client'
});

Router.route('/insert_proc_desc', {
  name: 'insertProcDesc',
  controller: 'ProcedureDescriptionsController',
  action: 'insert',
  where: 'client'
});

Router.route('/proc_desc_list', {
  name: 'procDescList',
  controller: 'ProcedureDescriptionsController',
  action: 'list',
  where: 'client'
});

Router.route('/proc_desc/:_id', {
  name: 'editProcDesc',
  controller: 'ProcedureDescriptionsController',
  action: 'edit',
  where: 'client'
});

Router.route('/profile_edit', {
  name: 'profileEdit',
  controller: 'UserProfileController',
  action: 'edit',
  where: 'client'
});

Router.route('/proc_desc_version/:_id', {
  name: 'viewProcDescVersion',
  controller: 'ProcedureDescriptionVersionController',
  action: 'view',
  where: 'client'
});

Router.route('/proc_desc_view/:_id', {
  name: 'viewProcDesc',
  controller: 'ProcedureDescriptionsController',
  action: 'view',
  where: 'client'
});

/**
*   Reference from https://github.com/ryanswapp/meteor-pdf-tutorial
*/
Router.route('/proc_desc_generate/:_doc', {
  name: 'generatePDF',
  where: 'server',
  action: function() {
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
    var data = this.params._doc

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

    // var pdfData = fut.wait();
    // var base64String = new Buffer(pdfData).toString('base64');
    //
    // return base64String;

    this.response.writeHead(200, {'Content-Type': 'application/pdf',"Content-Disposition": "attachment; filename=generated.pdf"});
    this.response.end(fut.wait());
  }
});

Router.onBeforeAction(function() {
  if (!Meteor.user()) {
    this.render('Home');
  } else {
    this.next();
  }
}, {only: ['procDescList', 'insertProcDesc', 'profileEdit']});
