const mongoose = require('mongoose');
const validator = require('validator'),
  bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true,'למשתמש חייב להיות שם משתמש'],
    unique: true,
    minlength:5,
    trim:true,
  },
  email: {
    type: String,
    required: [true,'למשתמש חייב להיות מייל'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
    trim:true,
  },
  password: {
    type: String,
    required: [true,'למשתמש חייב להיות סיסמא'],
    minlength:[8,"הסיסמא חייבת להיות באורך של לפחות 8 תווים"],
    maxlength:[16,"הסיסמא חייבת להיות באורך של עד 16 תווים"],
    select: false
  },
  friendsList: [
    {
      userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `user`,
      },
      reliability:{
        type: String,
        required:[true,"חייב לדרג את אמינות החבר"],
        enum:['הרבה','בינוני','מעט'],
      }
    },
  ],
  recommendationsList:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: `recommendation`,
    }
  ],


});

UserSchema.pre('save',async function(next){
  if(this.isModified('password')){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});



UserSchema.methods.checkPassword = async function (inputPassword,rightPassword){
  return await bcrypt.compare(inputPassword,rightPassword);
}

module.exports = User = mongoose.model('Users', UserSchema);
