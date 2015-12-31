Meteor.publish('proc_descs', function (userId) {
  if (typeof userId !== 'undefined') {
    return ProcDescs.find();
  }
});

Meteor.publish('proc_descs.vermongo', function (userId) {
  if (typeof userId !== 'undefined') {
    return ProcDescsVermongo.find();
  }
});

Meteor.publish('allUsers', function (userId) {
  if (typeof userId !== 'undefined') {
    return Meteor.users.find({},
       {fields: {'username': 1, 'emails': 1, 'profile': 1}});
  }
});
