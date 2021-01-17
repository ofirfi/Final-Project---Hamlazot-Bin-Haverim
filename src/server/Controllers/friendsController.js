const User = require('../models/User_model'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError');


const if_exists = (friendsList, new_friend) => {
    for (i = 0; i < friendsList.length; i++)
        if (new_friend.toString() === friendsList[i].userRef.toString())
            return true;
    return false;
}


module.exports = {

    search_users: catchAsync(async(req,res,next)=>{
        let {userName} = req.params
        const users = await User.find({userName : {$regex : userName}  },{userName});
        res.status(200).json({
            status:"success",
            results: users.length,
            data: users
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


        return res.status(200).json({
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

        res.status(204).json({
            status:"success",
            data: null
        });
    }),
};