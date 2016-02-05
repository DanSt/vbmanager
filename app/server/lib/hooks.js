if (Meteor.isServer) {
  ProcDescs.after.insert(function(userId, doc) {
    console.log("firing");
    Roles.addUsersToRoles(userId, doc._id);
  });

  ProcDescs.before.update(function(userId, doc, fieldNames, modifier, hook_options) {
    Roles.addUsersToRoles(userId, doc._id);
  });
}
