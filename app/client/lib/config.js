accountsUIBootstrap3.setLanguage('de'); // for Germa

Accounts.ui.config({
    requestPermissions: {},
    // passwordSignupFields: 'EMAIL_ONLY',
    extraSignupFields: [{
        fieldName: 'firstName',
        fieldLabel: 'Vorname',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Bitte tragen Sie Ihren Vornamen ein");
            return false;
          } else {
            return true;
          }
        }
    }, {
        fieldName: 'lastName',
        fieldLabel: 'Nachname',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Bitte tragen Sie Ihren Nachnamen ein");
            return false;
          } else {
            return true;
          }
        }
    }]
});

/**
*   Solution from http://stackoverflow.com/questions/27734110/authentication-on-server-side-routes-in-meteor
**/
Tracker.autorun(function() {
     //Update the cookie whenever they log in or out
     Cookie.set("meteor_user_id", Meteor.userId());
     Cookie.set("meteor_token", localStorage.getItem("Meteor.loginToken"));
});
/** Solution end **/
