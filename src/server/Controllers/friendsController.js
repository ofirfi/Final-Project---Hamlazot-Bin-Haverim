const User = require('../models/User_model'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError');



module.exports = {
            //Check about the sort [and userName instead of _id]
    get_friends : catchAsync(async (req, res,next) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    }),

    
    add_friend: catchAsync(async (req, res,next) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    }),


    update_friend: catchAsync(async(req, res,next) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    }),

    
    //In progress - need to delete from the user as well
    delete_friend: catchAsync(async(req, res,next) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    }),
};