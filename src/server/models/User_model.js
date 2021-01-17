const mongoose = require('mongoose'),
  validator = require('validator'),
  bcrypt = require('bcryptjs'),
  crypto = require('crypto');

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
    trim:true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please enter a valid E-mail!");
      }
    },
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
  passwordResetToken: String,
  passwordResetExpires: Date

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

UserSchema.methods.createResetPasswordToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() +10 * 60 * 1000; 
  return resetToken;
}

module.exports = User = mongoose.model('Users', UserSchema);
