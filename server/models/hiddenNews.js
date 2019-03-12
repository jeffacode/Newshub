var mongoose = require('mongoose');

var HiddenNewsSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  nid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true,
  },
});

HiddenNewsSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

var HiddenNews = mongoose.model('HiddenNews', HiddenNewsSchema, 'hiddenNews');
module.exports = HiddenNews;
