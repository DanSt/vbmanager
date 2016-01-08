Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound',
  onAfterAction: function() {
    window.scrollTo(0, 0);
  }
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
Router.route('/proc_desc_pdf/:_id', {
  name: 'generatePDF',
  where: 'server',
  action: function() {

    /**
    *   Solution from http://stackoverflow.com/questions/27734110/authentication-on-server-side-routes-in-meteor
    **/
    //Check the values in the cookies
    var cookies = new Cookies( this.request ),
      userId = cookies.get("meteor_user_id") || "",
      token = cookies.get("meteor_token") || "";

    //Check a valid user with this token exists
    var user = Meteor.users.findOne({
      _id: userId,
      'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(token)
    });

    //If they're not logged in tell them
    if (!user) {
      this.response.statusCode = 403;
      return this.response.end('Zugriff Verboten!');
    }
    /** Solution end **/

    var webshot = Meteor.npmRequire('webshot');
    var fs      = Npm.require('fs');
    var Future = Npm.require('fibers/future');

    var fut = new Future();

    var fileName = "verfahrensbeschreibung.pdf";

    // GENERATE HTML STRING
    var css = Assets.getText('style.css');

    SSR.compileTemplate('layout', Assets.getText('layout.html'));

    Template.layout.helpers({
      getDocType: function() {
        return "<!DOCTYPE html>";
      }
    });

    SSR.compileTemplate('proc_view', Assets.getText('procview.html'));

    Template.proc_view.helpers({
      dateFormatted: function (date) {
        return moment(date).format("DD.MM.YYYY");
      },
      contactInfo: function() {
        var contactInfo = ContactInfos.findOne({isDefault: true});
        return contactInfo && contactInfo.content;
      }
    });

    // PREPARE DATA
    var data = ProcDescs.findOne(this.params._id);
    if (!data) {
      data = ProcDescsVermongo.findOne(this.params._id);
    }
    // console.log(data._id);

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

    /**
    *   return base64:
    */
    // var base64String = new Buffer(pdfData).toString('base64');
    // return base64String;

    /**
    *   return PDF for download
    */
    this.response.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="verfahrensbeschreibung-'+data._id+'.pdf"',
      'Content-Length': pdfData.length
    });
    this.response.write(pdfData);
    this.response.end();
  }
});

Router.onBeforeAction(function() {
  if (!((Meteor.isClient) ? Meteor.userId() : this.userId)) {
    this.render('Home');
  } else {
    this.next();
  }
}, {only: ['procDescList', 'editProcDesc', 'insertProcDesc', 'profileEdit', 'viewProcDesc', 'viewProcDescVersion']});
