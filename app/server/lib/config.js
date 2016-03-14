/**
*   Disable new user registration
**/

Accounts.config({
  forbidClientAccountCreation : true
});

// Accounts.validateNewUser(function (user) {
//   return false
// });

Future = Npm.require('fibers/future');
writingMerkleLog = false;

var Logger = Meteor.npmRequire('bunyan');
log = new Logger({
  name: 'systemlog',
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    },
    {
      path: '/var/dstool/access.log',
      level: 'info'
    }
  ]
});
