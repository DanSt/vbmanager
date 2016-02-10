Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

Router.configureBodyParsers = function() {
  Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
    extended: true,
    limit: '20mb'
  }));
};

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

Router.route('/approve_proc_desc/:_id', {
  name: 'approveProcDesc',
  controller: 'ApproveController',
  waitOn: function(){
    // waitOn makes sure that this publication is ready before rendering your template
    return Meteor.subscribe('proc_descs');
  },
  onBeforeAction: function() {
    if (!Roles.userIsInRole(Meteor.user(), ['datenschutzBeauftragter'])) {
      this.redirect('home');
    } else {
      if (!this.states) {
        this.states = new ReactiveDict(null);
      }
      this.next();
    }
  },
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

// Router.route('/profile_edit', {
//   name: 'profileEdit',
//   controller: 'UserProfileController',
//   action: 'edit',
//   where: 'client'
// });

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

Router.map(function() {
  this.route('/receive', {
    name: 'serverReceiver',
    controller: 'ReceiveController',
    action: 'receiveSigned',
    where: 'server'
  });
});

Router.route('/admin_users', {
  name: 'adminUsers',
  where: 'client',
  action: function() {
    if (Roles.userIsInRole(Meteor.user(), ['admin'])) {
      this.render('accountsAdmin');
    }
  }
});

Router.route('/get_signature/:_id', {
  name: 'getSignature',
  where: 'server',
  action: function() {
    /**
    *   Solution from http://stackoverflow.com/questions/27734110/authentication-on-server-side-routes-in-meteor
    **/
    //Check the values in the cookies
    var cookies = new Cookies( this.request );
    var userid = cookies.get("meteor_user_id") || "";
    var token = cookies.get("meteor_token") || "";
    /** Solution end **/

    //Check a valid user with this token exists
    var user = Meteor.users.findOne({
      _id: userid,
      'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(token)
    });

    //If they're not logged in tell them

    var collection = ProcDescs;
    var doc = ProcDescs.findOne({_id: this.params._id});
    if (!doc) {
      collection = ProcDescsVermongo;
      doc = ProcDescsVermongo.findOne({_id: this.params._id});
    }

    if (!user || !Roles.userIsInRole(user._id, ['datenschutzBeauftragter']) && doc.modifierId !== user._id) {
      this.response.writeHead(401);
      this.response.end();
    }

    var files = ProcDescArchiveFiles.find({_id: doc.archive.files}).fetch()[0];
    var signatur = new Buffer(files.signature, 'base64');

    this.response.writeHead(200, {
      'Content-Type': 'application/application',
      'Content-Disposition': 'attachment; filename="verfahrensbeschreibung-'+this.params._id+'-signatur.pcs7"',
      'Content-Length': signatur.length
    });
    this.response.write(signatur);
    this.response.end();
  }
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
    var cookies = new Cookies( this.request );
    var userid = cookies.get("meteor_user_id") || "";
    var token = cookies.get("meteor_token") || "";
    /** Solution end **/

    // retrieve base64 data of pdf and convert it to binary
    var pdf = Meteor.call('proc_desc_pdf', userid, token, this.params._id);

    if (pdf == "") {
      this.response.writeHead(401);
      this.response.end();
      return;
    }

    var pdfData = new Buffer(pdf, 'base64');

    moment.locale('de');
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    this.response.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="vb-'+this.params._id+'-'+currentDate+'.pdf"',
      'Content-Length': pdfData.length
    });

    this.response.write(pdfData);
    this.response.end();
  }
});

Router.route('/proc_desc_archive/:_id', {
  name: 'getArchive',
  where: 'server',
  action: function() {

    /**
    *   Solution from http://stackoverflow.com/questions/27734110/authentication-on-server-side-routes-in-meteor
    **/
    //Check the values in the cookies
    var cookies = new Cookies( this.request );
    var userid = cookies.get("meteor_user_id") || "";
    var token = cookies.get("meteor_token") || "";
    /** Solution end **/

    // retrieve base64 data of pdf and convert it to binary
    var archive = Meteor.call('proc_desc_archive', userid, token, this.params._id);

    if (archive == "") {
      this.response.writeHead(401);
      this.response.end();
      return;
    }

    var archiveData = new Buffer(archive, 'base64');

    moment.locale('de');
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    this.response.writeHead(200, {
      'Content-Type': 'application/zip',
      'Pragma': 'public',
      'Expires': '0',
      'Cache-Control': 'private, must-revalidate, post-check=0, pre-check=0',
      'Content-Transfer-Encoding': 'binary',
      'Content-Disposition': 'attachment; filename="vba-'+this.params._id+'-'+currentDate+'.zip"',
      'Content-Length': archiveData.length
    });

    this.response.write(archiveData);
    this.response.end();
  }
});

Router.onBeforeAction(function() {
  if (!((Meteor.isClient) ? Meteor.userId() : this.userId)) {
    this.render('Home');
  } else {
    this.next();
  }
}, {only: [ 'procDescList',
            'editProcDesc',
            'insertProcDesc',
            'approveProcDesc',
            'adminUsers',
            'viewProcDesc',
            'viewProcDescVersion'
          ]});
