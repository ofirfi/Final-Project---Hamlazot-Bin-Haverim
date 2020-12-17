const jwt = require('jsonwebtoken'),
    User = require('../models/User_model'),
    config = require('config'),
    AppError = require('../utils/appError'),
    catchAsync = require('../utils/catchAsync')

const signToken = id => jwt.sign({id},config.get('JWT_SECRET'),{expiresIn:config.get('JWT_EXPIRES_IN')});

module.exports = {
    
    login : catchAsync(async (req,res,next) => {
        const {email,password} = req.body;
        if(!email || !password)
            return next(new AppError('Please provide an email and a password',400));
        
        const user = await User.findOne({ email }).select('+password');
        if(!user || !(await user.checkPassword(password,user.password)))
            return next(new AppError('Wrong email or password',404));

        res.status(201).json({
            status:"success",
            token: signToken(user._id)
        })
    }),

    register: catchAsync(async (req, res, next) => {
        const user = await User.create({
            userName : req.body.userName,
            email : req.body.email,
            password : req.body.password,
            friendsList: [],
            recommendationsList: []
        });

        res.status(201).json({
            status: "success",
            token : signToken(user._id),
            data: user
        });
    })
}
    