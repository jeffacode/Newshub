var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true,
  },
  subscribers: {
    type: Number,
    required: true,
    default: 0,
  },
});

CategorySchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

var Category = mongoose.model('Category', CategorySchema, 'category');
module.exports = Category;
