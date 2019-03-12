var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var SALT_FACTOR = 5; // 哈希次数，越高越安全

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

// 比较密码
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, callback);
}

// 保存操作前的回调函数
UserSchema.pre('save', function(next) {
  var user = this;
  // 如果密码没有更改直接下一步
  if (!user.isModified('password')) {
    return next();
  }
  // 如果密码更改重新加密保存
  return bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    return bcrypt.hash(user.password, salt, function(err, hashedPassword) {
      if (err) {
        return next(err);
      }
      user.password = hashedPassword;
      return next();
    });
  });
})

// 反序列化时去掉_id转换成id，并且不带_v
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

var User = mongoose.model('User', UserSchema, 'user');
module.exports = User;
