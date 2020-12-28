const { default: validator } = require('validator');
const { findOneAndUpdate } = require('../models/User_model');
const User = require('../models/User_model'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError');



const get_Friends_list = async friendsList => {
    let friends = []
    for (i = 0; i < friendsList.length; i++) {
        const user = await User.findById(friendsList[i].userRef);
        let reliability = friendsList[i].reliability;
        let user_name = user.userName;
        friends.push({ user_name, reliability })
    }
    return friends
};

const if_exists = (friendsList, new_friend) => {
    for (i = 0; i < friendsList.length; i++)
        if (new_friend.toString() === friendsList[i].userRef.toString())
            return true;
    return false;
}

module.exports = {
    //Check about the sort [and userName instead of _id]
    get_friends: catchAsync(async (req, res, next) => {
        const user = await User.findOne({ userName: req.body.userName });
        if (!user)
            return next(new AppError('User was not found', 404));

        const friends = await get_Friends_list(user.friendsList);

        return res.status(201).json({
            stats: "success",
            results: friends.length,
            data: friends
        });
    }),


    add_friend: catchAsync(async (req, res, next) => {
        let user = await User.findOne({ userName: req.body.userName });
        const new_friend = await User.findOne({ userName: req.body.friend });
        if (!user || !new_friend)
            return next(new AppError('User was not found', 404));

        if (user._id.toString() === new_friend._id.toString())
            return next(new AppError("Can't add yourself", 400));

        if (if_exists(user.friendsList, new_friend._id))
            return next(new AppError('Friend already exists', 500));

        user.friendsList.push({
            userRef: new_friend,
            reliability: req.body.reliability
        });
        await user.save();
        return res.status(201).json({
            stats: "success",
            data: {
                userName: new_friend.userName,
                reliability: req.body.reliability
            }
        });
    }),

    //Change the friend's reliability
    update_friend: catchAsync(async (req, res, next) => {
        const user = await User.findOne({ userName: req.body.userName });
        const friend = await User.findOne({ userName: req.body.friend });
        if (!user || !friend || !if_exists(user.friendsList, friend._id))
            return next(new AppError('User was not found', 404));

        await User.findOneAndUpdate({
            userName: req.body.userName,
            'friendsList.userRef': friend._id
        },
            {
                $set: { 'friendsList.$.reliability': req.body.reliability }
            },
            { runValidators: true });


        return res.status(201).json({
            stats: "success",
            data: {
                userName: friend.userName,
                reliability: req.body.reliability
            }
        });

    }),


    
    delete_friend: catchAsync(async (req, res, next) => {
        let user = await User.findOne({ userName: req.body.userName });
        const friend = await User.findOne({ userName: req.body.friend });
        if (!user || !friend || !if_exists(user.friendsList, friend._id))
            return next(new AppError('User was not found', 404));

        await User.findOneAndUpdate({ userName: req.body.userName, }, {
            $pull: { friendsList: { userRef: friend._id } }
        });

        res.status(201).json({
            status:"success",
            data: null
        });

    }),
};