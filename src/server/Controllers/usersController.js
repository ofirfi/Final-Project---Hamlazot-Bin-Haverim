const User = require('../models/User_model'),
    Recommendation = require('../models/Recommendation_model'),
    AppError = require('../utils/appError'),
    catchAsync = require('../utils/catchAsync');


const get_Friends_list = async (friendsList,personal_profile) => {
    let friends = []
    for (i = 0; i < friendsList.length; i++) {
        const user = await User.findById(friendsList[i].userRef);
        let user_name = user.userName;
        if(personal_profile){
            let reliability = friendsList[i].reliability;
            friends.push({ user_name, reliability })
        } else
            friends.push({ user_name})
    }
    return friends
};

const create_send_Data = (res,data) =>  res.status(200).json({
    status: "success",
    results: 1,
    data
});



module.exports = {
        //a user's profile
    get_users_profile: catchAsync(async(req, res ,next) => {
        let user = await User.findOne({ userName: req.params.userName });
        if(!user)
            return next(new AppError('User was not found', 404));

        const friends = await get_Friends_list(user.friendsList,false);
        
        create_send_Data(res,{userName: user.userName,friends_length: friends.length,friends})        

    }),

        //The logged-in user profile
    get_profile: catchAsync(async(req,res,next)=>{
        let user = await User.findOne({ userName: req.body.userName });
        if(!user)
            return next(new AppError('User was not found', 404));
        
        const friends = await get_Friends_list(user.friendsList,true);

        create_send_Data(res,{email:user.email,userName: user.userName,friends_length: friends.length,friends})        
        // return res.status(200).json({
        //     stats: "success",
        //     results: 1,
        //     data: {
        //         email: user.email,
        //         userName: user.userName,
        //         friends_length: friends.length,
        //         friends
        //     }
        // });
    }),



        //In progress - also delete all of this user's recommendations?
    delete_user: catchAsync(async(req, res,next) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    }),
};