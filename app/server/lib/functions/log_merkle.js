log_merkle = function() {
  var fs = Npm.require('fs');
  var path = Npm.require('path');
  var hash_file = Meteor.npmRequire('hash_file');

  if (writingMerkleLog) {
    return false;
  }

  var merkle_tree = MerkleTree.find({name: "System Baum"}).fetch()[0];

  
  // block merkleTreeLog lock
  /**
  *   check current log file if at newest merkle tree
  *   If not, load all other merkle trees and log them in, until the newest one
  *   unblock lock and return true
  *   on error return false
  **/

  var archivePath = process.env.ARCHIVE_PATH;
  var logPath = path.join(archivePath, 'logs');
  var versionString = String(Number(10000000) + (Number(merkle_tree.version))/100).substring(1,8);
  var filePath = path.join(logPath, "merkle_trees-" + versionString + ".log");

  fs.appendFile(filePath, JSON.stringify(merkle_tree), function (err) {

  });
}
