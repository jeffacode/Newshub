var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
  cid: {
    type: String,
    ref: 'Category',
    required: true,
  },
  votes: {
    type: Number,
    required: true,
    default: 0,
  },
  upvotes: {
    type: Number,
    required: true,
    default: 0,
  },
  downvotes: {
    type: Number,
    required: true,
    default: 0,
  },
  source: {
    name: String,
  },
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  content: String,
});

NewsSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

var News = mongoose.model('News', NewsSchema, 'news');
module.exports = News;
