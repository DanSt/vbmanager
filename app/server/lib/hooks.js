if (Meteor.isServer) {
  ProcDescs.after.insert(function(userId, doc) {
    Roles.createRole(doc._id);
    if (typeof userId !== 'undefined' && !Roles.userIsInRole(userId, 'datenschutzBeauftragter')) {
      Roles.addUsersToRoles(userId, doc._id);
    }
  });

  ProcDescs.before.update(function(userId, doc, fieldNames, modifier, hook_options) {
    if (typeof userId !== 'undefined' && !Roles.userIsInRole(userId, 'datenschutzBeauftragter')) {
      Roles.addUsersToRoles(userId, doc._id);
    }
  });
}
