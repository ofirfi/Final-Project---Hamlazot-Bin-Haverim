const User = require('../models/User_model'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError');


const get_data = async (req,res,next) =>{
    let user = await User.findOne({ userName: req.body.userName });
    const friend = await User.findOne({ userName: req.body.friend });
    if (!user || !friend)
        return next(new AppError('User was not found', 404));
    return {user,friend}
}

const if_exists = (friendsList, friend) => {
    for (i = 0; i < friendsList.length; i++)
        if (friend.toString() === friendsList[i].userRef.toString())
            return true;
    return false;
}

const send_data = (res,statusCode,data) =>{
    res.status(statusCode).json({
        status: "success",
        data
    });
};

module.exports  = {

    search_users: catchAsync(async(req,res,next)=>{
        let {userName} = req.params
        const users = await User.find({userName : {$regex : userName}  },['userName','first_name','last_name']);
        send_data(res,200,{results: users.length,data: users});
    }),


    add_friend: catchAsync(async (req, res, next) => {
        let {user,friend} = await get_data(req,res,next);
        
        if (user._id.toString() === friend._id.toString())
            return next(new AppError("Can't add yourself", 400));

        if (if_exists(user.friendsList, friend._id))
            return next(new AppError('Friend already exists', 400));


        user.friendsList.push({
            userRef: friend,
            reliability: req.body.reliability
        });
        await user.save();

        send_data(res,200,{ userName: friend.userName,reliability: req.body.reliability});
    }),

    
    //Change the friend's reliability
    update_friend: catchAsync(async (req, res, next) => {
        let {user,friend} = await get_data(req,res,next);
        
        if (!if_exists(user.friendsList, friend._id))
            return next(new AppError('User was not found', 404));

        await User.findOneAndUpdate(
            { userName: user.userName, 'friendsList.userRef': friend._id },
            { $set: { 'friendsList.$.reliability': req.body.reliability }},
            { runValidators: true });

        send_data(res,200,{ userName: friend.userName, reliability: req.body.reliability});
    }),

    
    delete_friend: catchAsync(async (req, res, next) => {
        let {user,friend} = await get_data(req,res,next);
        
        await User.findByIdAndUpdate(user, {
            $pull: { friendsList: { userRef: friend._id } }
        });

        send_data(res,204,null);
    }),
};