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
