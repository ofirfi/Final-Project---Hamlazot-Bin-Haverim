const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  placeId: {
    type: String,
    required: true,
  },
  userName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `user`,
    required: true,
  },
  Comment:{
    type: String,
    maxlength: 50,
  },
  Rate:{
    type: Number,
    required :true,
    min: 0,
    max: 5,
  },
  Date:{
    type: Date,
    required : true,
  },

});

module.exports = Recommendation = mongoose.model('recommendation', recommendationSchema);
