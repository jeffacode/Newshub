var express = require('express');
var passport = require('passport');
var router = express.Router();
var validateSignup = require('../utils/validateSignup');
var validateLogin = require('../utils/validateLogin');

// signup
router.post('/signup', function(req, res, next) {
  // 验证
  var validationResult = validateSignup(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors,
    });
  }

  // 鉴权
  return passport.authenticate('local-signup', function(err) {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors.',
          errors: {
            email: 'This email is already taken.',
          },
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up! Now you should be able to log in.',
    });
  })(req, res, next);
});

// login
router.post('/login', function (req, res, next) {
  // 验证
  var validationResult = validateLogin(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors,
    });
  }

  // 鉴权
  return passport.authenticate('local-login', function(err, token, userData) { // 此回调就是创建PassportLocalStrategy实例时的done
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Could not process the form: ' + err.message,
      });
    }

    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData,
    });
  })(req, res, next);
});



module.exports = router;
