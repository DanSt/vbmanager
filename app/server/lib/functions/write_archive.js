write_archive = function(doc) {
  var fs = Npm.require('fs');
  var path = Npm.require('path');

  var archive = create_archive(doc);

  var archivePath = process.env.ARCHIVE_PATH;
  var filePath = path.join(archivePath, 'vba-' + doc._id + "-" + doc._version + ".zip" );

  try {
    var stats = fs.statSync(filePath);
    console.log(filePath + " already exists");
  } catch (e) {
    var buffer = new Buffer(archive, "base64");
    fs.writeFileSync(filePath, buffer);
  }
}
