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

Router.onBeforeAction(function() {
  if (!Meteor.user()) {
    this.render('Home');
  } else {
    this.next();
  }
}, {only: ['procDescList', 'insertProcDesc', 'profileEdit']});
