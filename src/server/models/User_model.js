const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  friendsList: [
    {
      userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `user`,
      },
    },
  ],
  recommendationsList:[
    {
      recommendationsRef:{
        type: mongoose.Schema.Types.ObjectId,
        ref: `recommendation`,
      }
    }
  ],


});

module.exports = User = mongoose.model('Users', UserSchema);
