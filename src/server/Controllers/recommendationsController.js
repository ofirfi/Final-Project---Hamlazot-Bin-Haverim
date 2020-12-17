const Recommendation = require('../models/Recommendation_model'),
    Recs = require('../models/Recommendation_model2'),
    User = require('../models/User_model'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError');



module.exports = {
            //Check about the sort [and userName instead of _id]
    getRecommendations : catchAsync(async (req, res,next) => {
        const recommendations = await Recommendation.find().sort('placeId');
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
        return res.status(201).json({ stats: "success", data: recommend });
        
                //a new recommendation, if none is existed
        recommend = await Recommendation.create({
            placeId,
            userName: user,
            comment,
            rate,
        })
                //Add the recommendation to the user's list
        user.recommendationsList.push({ recommend });
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
            return next(new AppError('recommendation does not exists',404));
        
        res.status(201).json({
            status:"success",
            data: recommend
        });
    }),

    
    //In progress - need to delete from the user as well
    delete_recommendation: catchAsync(async(req, res,next) => {
        const { placeId, userName } = req.body;
        let user = await User.findOne({ userName });
        if(!user)
            return next(new AppError('user does not exists',404));

        const recommand = await Recommendation.findOne({placeId,userName:user});
        if(!recommand)
            return next(new AppError('recommendation does not exists',404));
        
        recommand.delete();
        res.status(204).send({
            status:"success",
            data:"null"
        })
    }),
};