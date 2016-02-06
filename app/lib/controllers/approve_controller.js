ApproveController = RouteController.extend({

  // A place to put your subscriptions
  // this.subscribe('items');
  // // add the subscription to the waitlist
  // this.subscribe('item', this.params._id).wait();

  subscriptions: function() {
    this.subscribe('proc_descs');
  },

  // Subscriptions or other things we want to "wait" on. This also
  // automatically uses the loading hook. That's the only difference between
  // this option and the subscriptions option above.
  // return Meteor.subscribe('post', this.params._id);

  data: function () {
    return ProcDescs.findOne({_id: this.params._id});
  },

  // actions to be performed

  approve: function() {
    var that = this;
    Meteor.call('proc_desc_pdf', Meteor.userId(), localStorage.getItem("Meteor.loginToken"), this.params._id, function(err, res) {
      if (res) {
        if (!that.states) {
          that.states = new ReactiveDict(null);
        }
        that.states.set('pdfData', res);
        that.render('ApproveProcDesc', {});
      }
    });
  }

});
