const jwt = require('jsonwebtoken'),
    {promisify} = require('util')
    User = require('../models/User_model'),
    config = require('config'),
    AppError = require('../utils/appError'),
    catchAsync = require('../utils/catchAsync')

const signToken = id => jwt.sign({id},config.get('JWT_SECRET'),{expiresIn:config.get('JWT_EXPIRES_IN')});

const createSendtoken = (user,statusCode,res) =>{
    res.status(statusCode).json({
        status: "success",
        token : signToken(user._id),
        data: user
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

        createSendtoken(user,201,res);
    }),


    register: catchAsync(async (req, res, next) => {
        const new_user = await User.create({
            userName : req.body.userName,
            email : req.body.email,
            password : req.body.password,
            friendsList: [],
            recommendationsList: []
        });
        createSendtoken(new_user,201,res);
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

        createSendtoken(user,201,res)   
    }),

    protect: catchAsync(async (req, res, next) => {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
            return next(new AppError("You are not logged in! Please log in to get access.", 401));

        const token = req.headers.authorization.split(' ')[1];

        const decoded = await promisify(jwt.verify)(token, config.get('JWT_SECRET'));


        const user = await User.findById(decoded.id);
        if (!user)
            return next(new AppError('The user belonging to this token does no longer exist.', 401));

        next();
    }),
}
    