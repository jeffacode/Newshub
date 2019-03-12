var mongoose = require('mongoose');

module.exports = {
  connect: function(uri) {
    // 连接MongoDB数据库
    mongoose.connect(uri);
    // 监听连接错误
    mongoose.connection.on('error', function(err) {
      console.error('Mongoose connection error: ' + err);
      process.exit(1);
    });
  }
}