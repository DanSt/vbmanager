print_certs = function(signature) {
  var fut3 = new Future();
  var spawn = Npm.require('child_process').spawn;
  //
  var command = spawn('/bin/sh', ['-c', 'echo ' + signature.toString('base64') + ' | base64 --decode | openssl pkcs7 -in /dev/stdin -text -inform DER -print_certs']);

  command.stdout.on('data', function (data) {
    fut3.return(data.toString());
  });

  command.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  var certInfo = fut3.wait();
  return certInfo;
}
