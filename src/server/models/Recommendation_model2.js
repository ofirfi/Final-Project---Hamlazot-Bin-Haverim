const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  placeId: {
    type: String,
    required: true,
  },
  comments:[{
    userName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `user`,
      required: true,
    },
    comment:{
      type: String,
      maxlength: 50,
    },
    rate:{
      type: Number,
      required :true,
      min: 0,
      max: 5,
    },
    date:{
      type: Date,
      default : Date.now()
    },
  }],
});

module.exports = Recommendation = mongoose.model('Recommendations2', RecommendationSchema);
