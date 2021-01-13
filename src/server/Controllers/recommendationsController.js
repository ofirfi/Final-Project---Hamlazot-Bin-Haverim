const Recommendation = require('../models/Recommendation_model'),
    Recs = require('../models/Recommendation_model2'),
    User = require('../models/User_model'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError');

const updateRecommendation = async req => {
    const { placeId, userName, comment, rate } = req.body;
    let user = await User.findOne({ userName });
    let recommend = await Recommendation.findOneAndUpdate(
        { placeId, userName: user },
        { comment, rate, date:Date.now() },
        { new: true, runValidators: true }
    );
    return {recommend,user};
}

const create_Send_Data = (res,data,results,statusCode) =>  res.status(statusCode).json({
    status: "success",
    results,
    data
});

module.exports = {
            //Change the userName from the user id to user name
    getRecommendations : catchAsync(async (req, res,next) => {
        const recommendations = await Recommendation.find().sort('placeId userName');
        create_Send_Data(res,{recommendations},recommendations.length,200);
    }),

    
    create_recommendation: catchAsync(async (req, res,next) => {
        let {recommend,user} = await updateRecommendation(req);
        
        if (recommend)
            return res.status(201).json({ status: "success", data: recommend });

                //a new recommendation, if none is existed
        recommend = await Recommendation.create({
            placeId : req.body.placeId,
            userName: user,
            comment: req.body.comment,
            rate: req.body.rate,
        });

                //Add the recommendation to the user's list
        user.recommendationsList.push(recommend);
        await user.save();

        create_Send_Data(res,recommend,1,200);
    }),


    update_recommendation: catchAsync(async(req, res,next) => {
        const {recommend,user} = await updateRecommendation(req);
                //If the recommendation does not exist
        if(!recommend)
            return next(new AppError('recommendation was not found',404));
        
        create_Send_Data(res,recommend,1,200);
    }),

    
    delete_recommendation: catchAsync(async(req, res,next) => {
        const { placeId, userName } = req.body;
        let user = await User.findOne({ userName });
        if(!user)
            return next(new AppError('User was not found',404));
     
        const recommend = await Recommendation.findOneAndDelete({placeId,userName:user});
        if(!recommend)
            return next(new AppError('Recommendation was not found',404));

        await User.findOneAndUpdate({ userName: req.body.userName, }, {
            $pull: { recommendationsList: recommend._id }
        });

        create_Send_Data(res,null,0,204);

    }),
};