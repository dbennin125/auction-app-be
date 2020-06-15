const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  }, expires: {
    type: Date,
    required: true
  }
}, {
   
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
      delete ret.passwordHash;
    }
  }

});

module.exports = mongoose.model('Autction', schema);
