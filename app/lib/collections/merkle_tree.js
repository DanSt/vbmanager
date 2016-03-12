MerkleTree = new Mongo.Collection('merkle_tree').vermongo({timestamps: true, ignoreFields: []});
MerkleTreeVermongo = MerkleTree.getVersionCollection();

MerkleTreeSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    defaultValue: "System Baum"
  },
  merkleTree: {
    type: [[String]],
    label: "Merkle Baum"
  },
  ids: {
    type: [String],
    label: "Dokumenten IDs"
  },
  rootHash: {
    type: String,
    label: "Root Hash",
    max: 256
  }
});

MerkleTree.attachSchema(MerkleTreeSchema);

if (Meteor.isServer) {
  MerkleTree.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });

  MerkleTreeVermongo.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });
}
