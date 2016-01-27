ProcedureDescriptionsController = RouteController.extend({

  // A place to put your subscriptions
  // this.subscribe('items');
  // // add the subscription to the waitlist
  // this.subscribe('item', this.params._id).wait();

  subscriptions: function() {
    this.subscribe('proc_descs', Meteor.userId());
    this.subscribe('proc_descs.vermongo', Meteor.userId());
    this.subscribe('allUsers', Meteor.userId());
    this.subscribe('contact_infos', Meteor.userId());
  },

  // Subscriptions or other things we want to "wait" on. This also
  // automatically uses the loading hook. That's the only difference between
  // this option and the subscriptions option above.
  // return Meteor.subscribe('post', this.params._id);

  data: function () {
    return ProcDescs.findOne({_id: this.params._id});
  },

  // actions to be performed

  insert: function () {
    this.render('InsertProcDesc', {});
  },

  list: function () {
    this.render('ProcDescList', {});
  },

  edit: function () {
    this.render('EditProcDesc', {});
  },

  view: function () {
    this.render('ViewProcDescVersion', {});
  },

  approve: function() {
    this.render('ApproveProcDesc', {});
  }

});
