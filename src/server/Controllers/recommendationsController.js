const Recommendation = require('../models/Recommendation_model'),
    Recs = require('../models/Recommendation_model2'),
    User = require('../models/User_model'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError');



module.exports = {
            //Change the userName from the user id to user name
    getRecommendations : catchAsync(async (req, res,next) => {
        const recommendations = await Recommendation.find().sort('placeId userName');
        res.status(201).json({
            status: "success",
            results: recommendations.length,
            data: { recommendations }
        });
    }),

    
    create_recommendation: catchAsync(async (req, res,next) => {
        const { placeId, userName, comment, rate } = req.body;
        let user = await User.findOne({ userName });
                //Update the existing recommendation
        let recommend = await Recommendation.findOneAndUpdate(
            { placeId, userName: user },
            { comment, rate },
            { new: true, runValidators: true }
        )
        
        if (recommend)
            return res.status(201).json({ status: "success", data: recommend });
    
                //a new recommendation, if none is existed
        recommend = await Recommendation.create({
            placeId,
            userName: user,
            comment,
            rate,
        });
                //Add the recommendation to the user's list
        user.recommendationsList.push(recommend);
        await user.save();

        return res.status(201).json({ stats: "success", data: recommend });
    }),


    update_recommendation: catchAsync(async(req, res,next) => {
        const {placeId, userName, comment, rate } = req.body;
        let user = await User.findOne({ userName });
        let recommend = await Recommendation.findOneAndUpdate(
            { placeId, userName: user },
            { comment, rate },
            { new: true, runValidators: true }
        );
                //If the recommendation does not exist
        if(!recommend)
            return next(new AppError('recommendation was not found',404));
        
        res.status(201).json({
            status:"success",
            data: recommend
        });
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

        res.status(204).json({
            status:"success",
            data:"null"
        })
    }),
};