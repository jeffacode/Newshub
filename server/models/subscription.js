var mongoose = require('mongoose');

var SubscriptionSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cid: {
    type: String,
    ref: 'Category',
    required: true,
  },
});

SubscriptionSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

var Subscription = mongoose.model('Subscription', SubscriptionSchema, 'subscription');
module.exports = Subscription;
