// ProcDescArchives = new Mongo.Collection('proc_desc_archives').vermongo({timestamps: true, userId: 'modifierId', ignoreFields: []});
// ProcDescArchivesVermongo = ProcDescArchives.getVersionCollection();
//
// ProcDescArchiveFilesSchema = new SimpleSchema({
//   originalDocument: {
//     type: String,
//     optional: true
//   },
//   signature: {
//     type: String,
//     optional: true
//   },
//   signatureCert: {
//     type: String,
//     optional: true
//   }
// });
//
// ProcDescArchiveMetaDataSchema = new SimpleSchema({
//   documentId: {
//     type: String,
//     max: 200,
//     optional: true
//   },
//   documentTitle: {
//     type: String,
//     max: 400,
//     optional: true
//   },
//   creator: {
//     type: String,
//     max: 300,
//     optional: true
//   },
//   creationDate: {
//     type: String,
//     optional: true
//   },
//   documentFileName: {
//     type: String,
//     max: 300,
//     optional: true
//   },
//   documentFormat: {
//     type: String,
//     max: 20,
//     optional: true,
//     defaultValue: 'base64'
//   },
//   documentDigest: {
//     type: String,
//     max: 200,
//     optional: true
//   },
//   documentDigestAlgorithm: {
//     type: String,
//     max: 200,
//     defaultValue: "SHA256",
//     optional: true
//   },
//   signatureFileName: {
//     type: String,
//     max: 300,
//     optional: true
//   },
//   signatureFormat: {
//     type: String,
//     max: 20,
//     optional: true,
//     defaultValue: 'base64'
//   },
//   signatureDigest: {
//     type: String,
//     max: 200,
//     optional: true
//   },
//   signatureDigestAlgorithm: {
//     type: String,
//     max: 200,
//     defaultValue: "SHA256",
//     optional: true
//   },
//   signatureCertFileName: {
//     type: String,
//     max: 300,
//     optional: true
//   },
//   signatureCertFormat: {
//     type: String,
//     max: 20,
//     optional: true,
//     defaultValue: 'base64'
//   },
//   signatureCertDigest: {
//     type: String,
//     max: 200,
//     optional: true,
//   },
//   signatureCertDigestAlgorithm: {
//     type: String,
//     max: 200,
//     optional: true,
//     defaultValue: "SHA256"
//   },
//   versionNumber: {
//     type: Number,
//     optional: true
//   }
// });
//
// ProcDescArchiveSchema = new SimpleSchema({
//   metaData: {
//     type: ProcDescArchiveMetaDataSchema,
//     optional: true
//   },
//   files: {
//     type: ProcDescArchiveFilesSchema,
//     optional: true
//   }
// });
//
// ProcDescArchives.attachSchema(ProcDescArchiveSchema);
//
// if (Meteor.isServer) {
//   ProcDescArchives.allow({
//     insert: function (userId, doc) {
//       return false;
//     },
//
//     update: function (userId, doc, fieldNames, modifier) {
//       return false;
//     },
//
//     remove: function (userId, doc) {
//       return false;
//     }
//   });
// }
