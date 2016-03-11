write_archive = function(archive) {
  var fs = Npm.require('fs');
  var path = Npm.require('path');

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
}
