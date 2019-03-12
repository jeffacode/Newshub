var mongoose = require('mongoose');

var SavedNewsSchema = new mongoose.Schema({
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

SavedNewsSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

var SavedNews = mongoose.model('SavedNews', SavedNewsSchema, 'savedNews');
module.exports = SavedNews;
