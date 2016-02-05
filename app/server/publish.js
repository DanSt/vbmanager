Meteor.publish('proc_descs', function () {
  if (!Roles.userIsInRole('datenschutzBeauftragter')) {
    var roles = Roles.getRolesForUser(this.userId);
    return ProcDescs.find({_id: {$in: roles }});
  } else {
    return ProcDescs.find();
  }
  // if (this.userId && Roles.userIsInRole(this.userId, ['datenschutzBeauftragter'])) {
  //   return ProcDescs.find();
  // } else if (this.userId) {
  //   return ProcDescs.find({modifierId: this.userId});
  // }
});

Meteor.publish('proc_descs.vermongo', function () {
  if (!Roles.userIsInRole('datenschutzBeauftragter')) {
    var roles = Roles.getRolesForUser(this.userId);
    return ProcDescsVermongo.find({ref: {$in: roles }});
  } else {
    return ProcDescsVermongo.find();
  }
  // if (this.userId && Roles.userIsInRole(this.userId, ['datenschutzBeauftragter'])) {
  //   return ProcDescsVermongo.find();
  // } else if (this.userId) {
  //   return ProcDescsVermongo.find({modifierId: this.userId});
  // }
});

Meteor.publish('contact_infos', function () {
  if (this.userId) {
    return ContactInfos.find();
  }
});
