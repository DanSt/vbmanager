Template.MasterLayout.helpers({
});

Template.MasterLayout.events({
});

accountsUIBootstrap3.logoutCallback = function(error) {
  if(error) console.log("Error:" + error);
  Router.go('home');
};
