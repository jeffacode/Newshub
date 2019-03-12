var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../server.config.json');

module.exports = function(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) {
    return next(); // token不存在
  }

  return jwt.verify(token, config.jwtSecret, function(err, decoded) {
    if (err) {
      return next(); // token验证不通过
    }

    var uid = decoded.uid;
    return User.findById(uid, function(err, user) {
      if (err) {
        return next(); // 数据库查询错误
      }

      if (!user) {
        return next(); // 没有找到用户
      }

      req.uid = uid; // 将用户id赋给req
      return next();
    });
  });
}