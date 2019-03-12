var mongoose = require('mongoose');

var VotedNewsSchema = new mongoose.Schema({
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
  voted: {
    type: Number,
    required: true,
  },
});

VotedNewsSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

var VotedNews = mongoose.model('VotedNews', VotedNewsSchema, 'votedNews');
module.exports = VotedNews;
