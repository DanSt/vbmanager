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

Router.route('/approve_proc_desc', {
  name: 'approveProcDesc',
  controller: 'ProcedureDescriptionsController',
  action: 'approve',
  where: 'client'
});

Router.route('/proc_desc/:_id', {
  name: 'editProcDesc',
  controller: 'ProcedureDescriptionsController',
  action: 'edit',
  onAfterAction: function() {
    window.scrollTo(0, 0);
  },
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
  onAfterAction: function() {
    window.scrollTo(0, 0);
  },
  where: 'client'
});

Router.route('/proc_desc_view/:_id', {
  name: 'viewProcDesc',
  controller: 'ProcedureDescriptionsController',
  action: 'view',
  onAfterAction: function() {
    window.scrollTo(0, 0);
  },
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

    console.log("inside");
    // retrieve base64 data of pdf and convert it to binary
    var res = Meteor.call('proc_desc_pdf', this.params._id);

    var pdfData = new Buffer(res, 'base64');

    this.response.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="verfahrensbeschreibung-'+this.params._id+'.pdf"',
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
}, {only: ['procDescList', 'editProcDesc', 'insertProcDesc', 'approveProcDesc', 'profileEdit', 'viewProcDesc', 'viewProcDescVersion']});
