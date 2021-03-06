UserProfileSchema = new SimpleSchema({
  firstName: {
    type: String,
    label: "Vorname",
    regEx: /^[a-z0-9A-Z_ ]{2,25}$/,
    optional: true
  },
  lastName: {
    type: String,
    label: "Nachname",
    regEx: /^[a-z0-9A-Z_ ]{2,25}$/,
    optional: true
  },
  name: {
    type: String,
    label: "Anzeigename",
    regEx: /^[a-z0-9A-Z_, ]{2,25}$/,
    optional: true
  },
  cn: {
    type: String,
    label: "Common Name",
    regEx: /^[a-z0-9A-Z_]{2,25}$/,
    optional: true
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
  roles: {
    type: [String],
    optional: true
  },
  emails: {
    type: [Object],
    // label: "E-Mails",
    optional: true,
    minCount: 1,
    maxCount: 1
  },
  "emails.$.address": {
    type: String,
    label: "Adresse",
    regEx: /^[a-z0-9_\\.\\-]+@lrz\.de$/
  },
  "emails.$.verified": {
    type: Boolean,
    label: "ist verifiziert"
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
  },
  heartbeat: {
    type: Date,
    optional: true
  }
});

Meteor.users.attachSchema(UserSchema);

if (Meteor.isServer) {
  Meteor.users.allow({
    insert: function (userId) {
      if (Meteor.user()) {
        return true;
      } else {
        return false;
      }
    },
    update: function (userId, user, fields, modifier) {
      return (userId && Meteor.user()._id == userId || Roles.userIsInRole(Meteor.user()._id, 'admin'));
    },
    remove: function (userId) {
      return false;
    }
  });

  Accounts.onCreateUser(function(options, user) {
    // var lastName = options.profile.lastName.replace(" ", "_");
    // var newUsername = options.profile.firstName.toUpperCase().charAt(0) + options.profile.lastName;
    //
    // var counter = 0;
    // var baseUsername = newUsername;
    // while (Meteor.users.find({username: newUsername}).count() > 0) {
    //   counter = counter + 1;
    //   newUsername = baseUsername + counter;
    // }
    // user.username = newUsername;
    user.profile = options.profile;
    if (options.emails) {
      user.emails = options.emails;
    }

    return user;
  });

  // Meteor.users.after.update(function (userId, doc, fieldNames, modifier) {
  //   if (doc.profile && doc.username && fieldNames["username"]) {
  //     var lastName = doc.profile.lastName.replace(" ", "_");
  //     var newUsername = doc.profile.firstName.toUpperCase().charAt(0) + lastName;
  //
  //     if (newUsername !== doc.username) {
  //       var counter = 0;
  //       var baseUsername = newUsername;
  //       while (Meteor.users.find({username: baseUsername}).count() > 0) {
  //         counter = counter + 1;
  //         newUsername = baseUsername + counter;
  //       }
  //       if (Meteor.isServer) {
  //         Meteor.users.direct.update({_id: doc._id}, {$set: {username: newUsername}});
  //       }
  //     }
  //   }
  // });
}
