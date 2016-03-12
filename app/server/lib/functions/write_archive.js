write_archive = function(archive) {
  var fs = Npm.require('fs');
  var path = Npm.require('path');
  var hash_file = Meteor.npmRequire('hash_file');

  var archiveBase64 = create_archive(archive);

  var archivePath = process.env.ARCHIVE_PATH;
  var versionString = String(Number(10000000) + Number(archive.metaData.versionNumber)).substring(1,8);
  var filePath = path.join(archivePath, 'vba-' + archive.metaData.documentId + "-" + versionString + ".zip" );

  try {
    var stats = fs.statSync(filePath);
    console.log(filePath + " already exists");
  } catch (e) {
    var buffer = new Buffer(archiveBase64, "base64");
    fs.writeFileSync(filePath, buffer);
  }

  var writtenData = fs.readFileSync(filePath);

  // check if file was written correctly
  var archiveDigest = hash_file(new Buffer(archiveBase64, 'base64'), 'sha256').toUpperCase();
  var writtenDataDigest = hash_file(new Buffer(writtenData), 'sha256').toUpperCase();

  if (archiveDigest == writtenDataDigest) {
    return true;
  } else {
    return false;
  }
}
