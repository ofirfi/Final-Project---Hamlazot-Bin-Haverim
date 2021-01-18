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
            friends.push({ user_name, reliability });
        } else
            friends.push({ user_name});
    }
    return friends
};


const make_Data = (user,friends,personal_profile) =>{
    let data = {
        userName: user.userName,
        friends_length: friends.length,
        friends
    };
    if(personal_profile)
        data.email = user.email;
    return data;
};


const send_Data = (res,data,statusCode) =>  
    res.status(statusCode).json({
        status: "success",
        data
    });



module.exports = {

        //Get a profile
    get_profile: catchAsync(async(req,res,next)=>{
        let user = await User.findOne({ userName: req.params.userName });
        if(!user)
            return next(new AppError('User was not found', 404));

        const friends = await get_Friends_list(user.friendsList,req.body.self);
            
        const data =  make_Data(user,friends,req.body.self);
        
        send_Data(res,data,200);
    }),



        //In progress - also delete all of this user's recommendations?
    delete_user: catchAsync(async(req, res,next) => {
        const userToDel = await User.findOneAndDelete({userName:req.params.userName});
        if(!userToDel)
            return next(new AppError('User was not found', 404));

            //Deleting the user's recommendations
        recommendations = await Recommendation.find({userName:userToDel});
        for (let i = 0 ;i<recommendations.length;i++)
            await Recommendation.findByIdAndDelete(recommendations[i]._id);

            //Deleting the user from other users friends list
        let users = await User.find({friendsList : {$elemMatch: {userRef: userToDel} } });
        for (let i = 0; i<users.length;i++){
            await User.findByIdAndUpdate(users[i]._id,{
                $pull: {friendsList : {userRef: userToDel }  }
            });
        }

        send_Data(res,null,204);
    }),
};