Meteor.startup(function () {
  LDAP_DEFAULTS.ldapsCertificate = Assets.getText('ldaps/ssl.pem');
  LDAP_DEFAULTS.port = 636;
  LDAP_DEFAULTS.url = "ldaps://auth.sim.lrz.de";

  LDAP_DEFAULTS.searchResultsProfileMap = [{
    resultKey: 'mwnSn',
    profileProperty: 'lastName'
  }, {
    resultKey: 'mwnGivenName',
    profileProperty: 'firstName'
  }, {
    resultKey: 'mwnAnzeigename',
    profileProperty: 'displayName'
  }];
  process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;
});
