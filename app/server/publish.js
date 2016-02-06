Meteor.publish('proc_descs', function () {
  if (!Roles.userIsInRole(this.userId, 'datenschutzBeauftragter')) {
    var roles = Roles.getRolesForUser(this.userId);
    return ProcDescs.find({_id: {$in: roles }});
  } else {
    return ProcDescs.find();
  }
});

Meteor.publish('proc_descs.vermongo', function () {
  if (!Roles.userIsInRole(this.userId, 'datenschutzBeauftragter')) {
    var roles = Roles.getRolesForUser(this.userId);
    return ProcDescsVermongo.find({ref: {$in: roles }});
  } else {
    return ProcDescsVermongo.find();
  }
});

Meteor.publish('contact_infos', function () {
  if (this.userId) {
    return ContactInfos.find();
  }
});
