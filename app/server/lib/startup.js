Meteor.startup(function () {
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

  /**
  *   Create default user account if none present
  **/
  if ( Meteor.users.find().count() === 0 ) {
    var id = Accounts.createUser({
        username: 'admin',
        emails: [{
          address: 'admin@lrz.de',
          verified: true
        }],
        password: 'nimda1234321',
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          name: 'Admin'
        }
    });

    Roles.addUsersToRoles(id, ['admin']);
  }

  if (Meteor.roles.find({name: 'datenschutzBeauftragter'}).count() < 1 ) {
		Roles.createRole('datenschutzBeauftragter');
	}

  return i18n.setDefaultLanguage('de');
});
