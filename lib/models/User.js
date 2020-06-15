const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String, 
    required: true
  },
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

//sets the password to a hash and salts it with bcryptjs
userSchema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.env.SALT || 10);
});

userSchema.statics.authorized = function(email, password) {
  return this.findOne({ email })
    .then(user => {
    //if no user throw error message
      if(!user) {
        throw new Error('Invalid Email/Password');
      }
      //if the user's password doesn't match throw error message
      if(!user.compare(password)) {
        throw new Error('Invalid Email/Password');
      }
      //if there is a user and password matches, return the user
      return user;
    });
};
//checks if passwords the same/used in line 37.
userSchema.methods.compare = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
