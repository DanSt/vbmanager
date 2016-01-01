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

Accounts.config({
  forbidClientAccountCreation : true
});

Accounts.validateNewUser(function (user) {
  return false
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

/**
*    Configure Autoform localized validation messages
**/
SimpleSchema.messages({
  required: "[label] ist notwendig",
  minString: "[label] muss mindestnes [min] Zeichen lang sein",
  maxString: "[label] darf nicht länger als [max] Zeichen sein",
  minNumber: "[label] darf nicht kleiner als [min] sein",
  maxNumber: "[label] darf nicht größer als [max] sein",
  minDate: "[label] muss nach [min] liegen",
  maxDate: "[label] darf nicht später als [max] liegen",
  badDate: "[label] ist kein gültiges Datum",
  minCount: "Es müssen mindestens [minCount] Werte angegeben werden",
  maxCount: "Es können nicht mehr als [maxCount] Werte angegeben werden",
  noDecimal: "[label] muss ein Integer sein",
  notAllowed: "[value] ist kein gültiger Wert",
  expectedString: "[label] muss vom Typ String sein",
  expectedNumber: "[label] muss vom Typ Nummer sein",
  expectedBoolean: "[label] muss vom Typ Boolean sein",
  expectedArray: "[label] muss vom Typ Array sein",
  expectedObject: "[label] muss vom Typ Object sein",
  expectedConstructor: "[label] muss vom Typ [type] sein",
  regEx: [
    {msg: "[label] hat die Regular Expression Validierung nicht bestanden"},
    {exp: SimpleSchema.RegEx.Email, msg: "[label] muss eine valide E-Mail Adresse sein"},
    {exp: SimpleSchema.RegEx.WeakEmail, msg: "[label] muss eine valide E-Mail Adresse sein"},
    {exp: SimpleSchema.RegEx.Domain, msg: "[label] muss eine valide Domain sein"},
    {exp: SimpleSchema.RegEx.WeakDomain, msg: "[label] muss eine valide Domain sein"},
    {exp: SimpleSchema.RegEx.IP, msg: "[label] muss eine valide IPv4 oder IPv6 Adresse sein"},
    {exp: SimpleSchema.RegEx.IPv4, msg: "[label] muss eine valide IPv4 Adresse sein"},
    {exp: SimpleSchema.RegEx.IPv6, msg: "[label] muss eine valide IPv6 Adresse sein"},
    {exp: SimpleSchema.RegEx.Url, msg: "[label] muss eine valide URL sein"},
    {exp: SimpleSchema.RegEx.Id, msg: "[label] muss eine valide alphanumerische ID sein"}
  ],
  keyNotInSchema: "[key] ist nicht innerhalb des Schemas erlaubt"
});
