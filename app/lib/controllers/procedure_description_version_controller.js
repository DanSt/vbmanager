ProcedureDescriptionVersionController = RouteController.extend({

  // A place to put your subscriptions
  // this.subscribe('items');
  // // add the subscription to the waitlist
  // this.subscribe('item', this.params._id).wait();

  subscriptions: function() {
    this.subscribe('proc_descs');
    this.subscribe('proc_descs.vermongo');
    this.subscribe('contact_infos');
  },

  // Subscriptions or other things we want to "wait" on. This also
  // automatically uses the loading hook. That's the only difference between
  // this option and the subscriptions option above.
  // return Meteor.subscribe('post', this.params._id);

  data: function () {
    var proc_desc = ProcDescsVermongo.findOne({_id: this.params._id});
    if (typeof proc_desc === 'undefined') {
      proc_desc = ProcDescs.findOne({_id: this.params._id});
    }
    return proc_desc;
  },

  view: function () {
    this.render('ViewProcDescVersion', {});
  },

});
