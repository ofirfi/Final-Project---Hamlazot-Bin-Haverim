const User = require('../models/User_model'),
    Recommendation = require('../models/Recommendation_model'),
    AppError = require('../utils/appError'),
    catchAsync = require('../utils/catchAsync');




const get_Friends_list = async (friendsList,personal_profile,sort_method) => {
    let friends = []
    for (let i = 0; i < friendsList.length; i++) {
        const user = await User.findById(friendsList[i].userRef);

        if(personal_profile)
            friends.push({ 
                userName: user.userName,
                reliability: friendsList[i].reliability,
                fullName: `${user.first_name} ${user.last_name}`
            });
        else
            friends.push({ 
                userName: user.userName,
                fullName: `${user.first_name} ${user.last_name}`
            });
    }
    if (personal_profile && sort_method === "reliability")
        friends.sort((friend1,friend2) => sort_By_Reliability(friend1,friend2));
    else
        friends.sort((friend1,friend2) => friend1.userName>friend2.userName? 1 : friend2.userName>friend1.userName? -1 : 0);
    return friends
};


const sort_By_Reliability = (friend1,friend2) =>{
    if (friend1.reliability === "הרבה"){
        if(friend2.reliability === "בינוני" || friend2.reliability === "מעט" )
            return -1;
    }

    if(friend1.reliability === "בינוני"){
        if (friend2.reliability === "הרבה")
            return 1;
        if (friend2.reliability === "מעט")
            return -1;
    }

    if (friend1.reliability === "מעט" && (friend2.reliability === "הרבה" ||friend2.reliability === "בינוני"))
        return 1;
    return friend1.userName>friend2.userName? 1 : friend2.userName>friend1.userName? -1 : 0 ;
}


const get_Recommendations_list = async (recommendations_list) =>{
    let recommendations = [];

    for (let i = 0; i < recommendations_list.length; i++){
        const recommendation = await Recommendation.findById(recommendations_list[i]);
        recommendations.push({
            rId: recommendation.rId,
            name: recommendation.name,
            type: recommendation.type,
            comment: recommendation.comment,
            date: recommendation.date,
            rate: recommendation.rate
        })
    }

    return recommendations;
};

const make_Data = (user,friends,recommendations,personal_profile) =>{
    let data = {
        userName: user.userName,
        firstName: user.first_name,
        lastName: user.last_name,
        friends_length: friends.length,
        friends,
        recommendations_length: recommendations.length,
        recommendations,
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
        let user = await User.findOne({ userName: req.body.userName });
        if(!user)
            return next(new AppError('User was not found', 404));
        
        const friends = await get_Friends_list(user.friendsList,req.body.self,req.body.sort);
    
        const recommendations = await get_Recommendations_list(user.recommendationsList);

        const data =  make_Data(user,friends,recommendations,req.body.self);
        
        send_Data(res,data,200);
    }),



        //In progress - also delete all of this user's recommendations?
    delete_user: catchAsync(async(req, res,next) => {
        const userToDel = await User.findOneAndDelete({userName:req.body.userName});
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