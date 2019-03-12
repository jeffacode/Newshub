var User = require('../models/user');
var PassportLocalStrategy = require('passport-local').Strategy;
require('colors');

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
}, function(req, email, password, done) {
  var userData = {
    email: email.trim(),
    password: password.trim(),
    username: req.body.username.trim(),
  }

  var newUser = new User(userData);

  newUser.save(function(err){
    if (err) {
      return done(err);
    }
    return done(null);
  });
});