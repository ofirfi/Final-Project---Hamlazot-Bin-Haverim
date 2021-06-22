const jwt = require('jsonwebtoken'),
    {promisify} = require('util'),
    User = require('../models/User_model'),
    config = require('config'),
    AppError = require('../utils/appError'),
    catchAsync = require('../utils/catchAsync'),
    sendEmail = require('../utils/email'),
    crypto = require('crypto');

const signToken = id => jwt.sign({id},config.get('JWT_SECRET'),{expiresIn:config.get('JWT_EXPIRES_IN')});

const createSendtoken = (user,statusCode,res,data) =>{
    res.status(statusCode).json({
        status: "success",
        token : signToken(user._id),
        data
    });
}

module.exports = {
    
    login : catchAsync(async (req,res,next) => {
        const {email,password} = req.body;
        if(!email || !password)
            return next(new AppError('Please provide an email and a password',400));
        
        const user = await User.findOne({ email }).select('+password');
        if(!user || !(await user.checkPassword(password,user.password)))
            return next(new AppError('Wrong email or password',401));
        
        createSendtoken(user,200,res,{userName:user.userName});
    }),


    register: catchAsync(async (req, res, next) => {
        const {userName,password,confirm_password} = req.body
        
        const user = await User.findOne({userTag : userName.toLowerCase()})
        if(user)
            return next(new AppError(`${userName} already exists`,400));
    
        if(password.toString() !== confirm_password.toString())
            return next(new AppError("password and confirm password do not match",400));

        const new_user = await User.create({
            userName,
            userTag : userName.toLowerCase(),
            email : req.body.email,
            password : req.body.password,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            friendsList: [],
            recommendationsList: []
        });
        createSendtoken(new_user,201,res,null);
    }),


    update_password: catchAsync(async (req,res,next) =>{
        const {userName,password,confirm_password,current_password} = req.body;
        let user = await User.findOne({userName}).select('+password');

        if(!user)
            return next(new AppError('User was not found', 404));    

        if(!password || !confirm_password || !current_password)
            return next(new AppError('missing password argument', 400));
      
        if(!await user.checkPassword(current_password,user.password))
            return next(new AppError('confirm password is wrong', 401));

        if (password != confirm_password)
            return next(new AppError('Password and confirmation password dont match', 400));

        user.password = password;
        await user.save()

        createSendtoken(user,204,res,null)   
    }),


    forgot_password: catchAsync(async (req,res,next) =>{
        const user = await User.findOne({email:req.body.email});
        if(!user)
            return next(new AppError('There is no user with this email address',404));

        const resetToken = user.createResetPasswordToken();
        await user.save()
        const resetURL = `${req.protocol}//${req.get('host')}/auth/resetPassword/${resetToken}`;
        const message = `Forgot your password?</p>
        <a href = ${resetURL}>Click here to reset your password</a></p>
        If you didn't forget your password, please ignore this email!`;

        try{
            await sendEmail({
                email:user.email,
                subject:'Your password reset (Valid for 10 minutes)',
                message
            });
            res.status(200).json({
                status:"success",
                message:"Reset email was sent"
            });
            
        } catch(err){
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            next(new AppError('There was an error sending the email. try again later!',500))
        }
    }),

    reset_password: catchAsync(async (req,res,next) =>{ 
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        }); 
        if(!user)
            return next(new AppError('Token is invalid or has expired',400));
        
        if(req.body.password !== req.body.confirm_password)
            return (new AppError('Password and confirm password dont match',400));
    
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        
        res.status(204).json({
            status:"success",
            data:null
        });
    }),


    protect: catchAsync(async (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
            token = req.headers.authorization.split(' ')[1];

        if (token == 'null' || !token)
            return next(new AppError("You are not logged in! Please log in to get access.", 401));

        const decoded = await promisify(jwt.verify)(token, config.get('JWT_SECRET'));

        const user = await User.findById(decoded.id);
        if (!user)
            return next(new AppError('The user belonging to this token does no longer exist.', 401));

        next();
    }),
}
    