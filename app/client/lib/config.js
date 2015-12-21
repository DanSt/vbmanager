Accounts.ui.config({
    requestPermissions: {},
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
    }, {
        fieldName: 'username',
        fieldLabel: 'Username',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Bitte tragen Sie Ihren Usernamen ein");
            return false;
          } else {
            return true;
          }
        }
    }]
});
