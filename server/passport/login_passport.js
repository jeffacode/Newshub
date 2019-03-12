var jwt = require('jsonwebtoken');
var User = require('../models/user');
var PassportLocalStrategy = require('passport-local').Strategy;
var config = require('../server.config.json');

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
}, function(req, email, password, done) {
  var userData = {
    email: email.trim(),
    password: password.trim(),
  }

  // 通过email字段查找用户
  return User.findOne({ email: userData.email }, function(err, user) {
    if (err) {
      return done(err);
    }
    
    // 用户不存在
    if (!user) {
      var error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';
      return done(error);
    }

    // 存在就继续验证密码
    return user.comparePassword(userData.password, function(err, isMatch) {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        var error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';
        return done(error);
      }

      // 签发JWT
      var payload = {
        uid: user.id,
      };
      var token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: 86400, // expires in 24 hours
      });

      // 设置随token一起传回前端的用户数据
      var data = {
        uid: user.id, // 用户id
        username: user.username, // 用户名
        email: user.email, // 用户邮箱
      };

      return done(null, token, data);
    });
  });
})