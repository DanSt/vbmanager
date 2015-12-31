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
