/*Accounts.createUser({
  email: user.email,
  password: user.password,
  firstName: user.firstName,
  lastName: user.lastName
});*/

UserProfileSchema = new SimpleSchema({
  firstName: {
    type: String,
    label: "Vorname",
    regEx: /^[a-z0-9A-Z_]{2,25}$/
  },
  lastName: {
    type: String,
    label: "Nachname",
    regEx: /^[a-z0-9A-Z_]{2,25}$/
  },
  birthday: {
    type: Date,
    optional: true
  }
});

UserSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  profile: {
    type: UserProfileSchema,
    optional: true
  }
});

Meteor.users.attachSchema(UserSchema);

Meteor.users.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return false;
  }
});
