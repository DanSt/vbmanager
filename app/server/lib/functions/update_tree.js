update_tree = function() {
  var currentTree = MerkleTree.find({name: "System Baum"}, {limit: 1}).fetch()[0];

  var approvedDocs = ProcDescsVermongo.find({"content.approved": true, "archive.metaData": {$ne: null}}, {sort: {modifiedAt: 1}, fields: {"archive.metaData": 1}}).fetch();

  var metaDatas = _.pluck(_.pluck(approvedDocs, "archive"), "metaData");

  var ids = _.map(metaDatas, function(doc) {return doc.documentId + "-" + doc.versionNumber});
  var rootHashes = _.pluck(metaDatas, "merkleRootHash");

  if (typeof currentTree !== "undefined") {
    ids.push("lastTree");
    rootHashes.push(currentTree.rootHash);
  }

  var merkleTree = create_merkle(rootHashes);

  var newTree = {
    name: "System Baum",
    merkleTree: merkleTree,
    ids: ids,
    rootHash: merkleTree[0][0]
  };

  if (typeof currentTree === "undefined") {
    MerkleTree.insert(newTree);
  } else {
    MerkleTree.update({_id: currentTree._id}, {$set: newTree});
  }

  // write out into log-file with http://stackoverflow.com/a/11267583
}
