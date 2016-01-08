/**
*   Disable new user registration
**/

Accounts.config({
  forbidClientAccountCreation : true
});

// Accounts.validateNewUser(function (user) {
//   return false
// });
