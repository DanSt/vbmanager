ProcDescArchiveFiles = new Mongo.Collection('proc_desc_files');

ProcDescArchiveFilesSchema = new SimpleSchema({
  originalDocument: {
    type: String,
    optional: true
  },
  signature: {
    type: String,
    optional: true
  },
  signatureCert: {
    type: String,
    optional: true
  }
});

ProcDescArchiveFiles.attachSchema(ProcDescArchiveFilesSchema);

if (Meteor.isServer) {
  ProcDescArchiveFiles.allow({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });
}
