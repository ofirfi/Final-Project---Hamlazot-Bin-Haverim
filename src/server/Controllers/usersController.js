const User = require('../models/User_model'),
    Recommendation = require('../models/Recommendation_model'),
    AppError = require('../utils/appError'),
    catchAsync = require('../utils/catchAsync');


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




module.exports = {
        //In progress -  the user's info + friends List & recommendations?
    read_user: catchAsync(async(req, res ,next) => {
        let user = await User.findOne({ userName: req.params.userName });
        if(!user)
            return next(new AppError('User was not found', 404));
   
        const friends = await get_Friends_list(user.friendsList);
        
        return res.status(200).json({
            stats: "success",
            results: 1,
            data: {
                userName: user.userName,
                email: user.email,
                friends_length: friends.length,
                friends
            }
        });
    }),

        //In progress - also delete all of this user's recommendations?
    delete_user: catchAsync(async(req, res,next) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    }),
};