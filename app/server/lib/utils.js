/**
*   Disable new user registration
**/

Accounts.config({
  forbidClientAccountCreation : false
});

Accounts.validateNewUser(function (user) {
  return true
});
