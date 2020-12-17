const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  placeId: {
    type: String,
    required: [true,"להמלצה חייב להיות שם המקום שממליצים עליו"],
    trim:true,
  },
  userName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `user`,
    required: [true,"להמלצה חייב להיות שם משתמש של הממליץ"],
  },
  comment:{
    type: String,
    maxlength: [100,"התגובה ארוכה מדי (עד 100 תווים)"],
    trim:true,
  },
  rate:{
    type: Number,
    required :[true,"להמלצה חייב להיות דירוג"],
    min: [0,"דירוג חייב להיות חיובי"],
    max: [5,"דירוג חייב להיות שווה או קטן מ-5"],
  },
  date:{
    type: Date,
    default : Date.now()
  },
});

module.exports = Recommendation = mongoose.model('Recommendations', RecommendationSchema);
