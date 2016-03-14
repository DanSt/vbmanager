Meteor.publish('proc_descs', function () {
  if (!Roles.userIsInRole(this.userId, 'datenschutzBeauftragter')) {
    var roles = Roles.getRolesForUser(this.userId);
    return ProcDescs.find({_id: {$in: roles }}, {fields: {'archive': 0, 'modifierId': 0, 'changes': 0}});
  } else {
    return ProcDescs.find({}, {fields: {'archive': 0}});
  }
});

Meteor.publish('proc_descs.vermongo', function () {
  if (!Roles.userIsInRole(this.userId, 'datenschutzBeauftragter')) {
    var roles = Roles.getRolesForUser(this.userId);
    return ProcDescsVermongo.find({ref: {$in: roles }}, {fields: {'archive': 0, 'modifierId': 0, 'changes': 0}});
  } else {
    return ProcDescsVermongo.find({}, {fields: {'archive': 0}});
  }
});

Meteor.publish('contact_infos', function () {
  if (this.userId) {
    return ContactInfos.find();
  }
});
