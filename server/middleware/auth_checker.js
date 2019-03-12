var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../server.config.json');

module.exports = function(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'No token provided.',
    });
  }

  // 验证JWT
  return jwt.verify(token, config.jwtSecret, function(err, decoded) {
    if (err) {
      return res.status(500).json({
        auth: false,
        message: 'Failed to authenticate token.'
      });
    }

    var uid = decoded.uid;
    return User.findById(uid, function(err, user) {
      if (err) {
        return res.status(500).json({
          auth: false,
          message: 'There was a problem finding the user.'
        });
      }

      if (!user) {
        return res.status(404).json({
          auth: false,
          message: 'No user found',
        });
      }

      // 一切正常，将用户id赋给req，之后的中间件就可以拿到用户id进行数据库查询
      req.uid = uid;
      return next();
    });
  });
}