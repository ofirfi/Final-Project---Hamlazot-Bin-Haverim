const User = require('../models/User_model'),
    Recommendation = require('../models/Recommendation_model'),
    AppError = require('../utils/appError'),
    catchAsync = require('../utils/catchAsync');


module.exports = {
        //In progress
    read_user: catchAsync(async(req, res ,next) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    }),
        //In progress
    update_user: catchAsync(async(req, res,next) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    }),

        //In progress - also delete all of this user's recommendations?
    delete_user: catchAsync(async(req, res,next) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    }),
};