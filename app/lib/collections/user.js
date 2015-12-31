/*Accounts.createUser({
  email: user.email,
  password: user.password,
  firstName: user.firstName,
  lastName: user.lastName
});*/

Meteor.users.after.update(function (userId, doc, fieldNames, modifier) {
  if (doc.profile && doc.username && fieldNames["username"]) {
    var newUsername = doc.profile.firstName.toUpperCase().charAt(0) + doc.profile.lastName;

    if (newUsername !== doc.username) {
      var counter = 0;
      var baseUsername = newUsername;
      while (Meteor.users.find({username: baseUsername}).count() > 0) {
        counter = counter + 1;
        newUsername = baseUsername + counter;
      }
      if (Meteor.isServer) {
        Meteor.users.direct.update({_id: doc._id}, {$set: {username: newUsername}});
      }
    }
  }
});

// Meteor.users.before.insert(function (userId, doc) {
//   var newUsername = doc.profile.firstName.toUpperCase().charAt(0) + doc.profile.lastName;
//
//   var counter = 0;
//   var baseUsername = newUsername;
//   while (Meteor.users.find({username: username}).count() > 0) {
//     counter = counter + 1;
//     newUsername = baseName + counter;
//   }
//   doc.username = newUsername;
// });

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
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
    optional: true
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

if (Meteor.isServer) {
  Meteor.users.allow({
    insert: function (userId, doc) {
      return true;
    },
    update: function (userId, doc) {
      return (userId && Meteor.user()._id == userId);
    },
    remove: function (userId, doc) {
      return false;
    }
  });

  Accounts.onCreateUser(function(options, user) {
    var newUsername = options.profile.firstName.toUpperCase().charAt(0) + options.profile.lastName;

    var counter = 0;
    var baseUsername = newUsername;
    while (Meteor.users.find({username: newUsername}).count() > 0) {
      counter = counter + 1;
      newUsername = baseUsername + counter;
    }
    user.username = newUsername;
    user.profile = options.profile;

    return user;
  });
}
