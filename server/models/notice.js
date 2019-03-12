var mongoose = require('mongoose');

var NoticeSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
  },
  message: {
    type: String,
  },
});

NoticeSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

var Notice = mongoose.model('Notice', NoticeSchema, 'notice');
module.exports = Notice;
