Template.EditUser.events({
  // 'submit form': function(event){
  //   /*alert('Die Verfahrensbeschreibung wurde gespeichert.');*/
  //   Router.go('procDescList');
  // },
  'click .cancel': function(event){
    /*alert('Die Verfahrensbeschreibung wurde gespeichert.');*/
    Router.go('procDescList');
  },
});

AutoForm.hooks({
  UserProfileEdit: {
    onSuccess: function(formType, result) {
      Router.go('procDescList');
    }
  }
});
