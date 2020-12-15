const Recommendation = require('../models/Recommendation_model'),
    Recs = require('../models/Recommendation_model2'),
    User = require('../models/User_model');


module.exports = {
        //change errors and validations and add sort
    getRecommendations : async (req, res) => {
        try{
            const recommendations = await Recommendation.find().sort('placeId');
            res.status(201).json({
                status:"success",
                results:recommendations.length,
                data:{recommendations}
            });
        }catch(err){
            console.log(err);
            return res.status(400).json({stats:"fail",message:"Invalid data sent"});
        }
    },

        //change errors and validations
    create_recommendation: async (req, res) => {
        // if (!req.body) return res.status(400).send("Bad request");
        // let {placeId,uid,comment,rate} = req.body;
        // if (!placeId) return res.status(400).send("missing 'placeId' attribute");
        // if (!userName) return res.status(400).send("missing userName' attribute");
        // if (!comment) return res.status(400).send("missing 'comment' attribute");
        // if (!rate) return res.status(400).send("missing 'rate' attribute");
       
        //check values types and validations
        try{
            let {placeId,userName,comment,rate} = req.body;
            let user = await User.findOne({userName});
            let recommend = await Recommendation.findOneAndUpdate(
                {placeId,userName:user},
                {comment,rate},
                {new : true}
                )
            if(!recommend){ //a new recommendation
                recommend = await Recommendation.create({
                    placeId,
                    userName :user,
                    comment,
                    rate,
                })
                user.recommendationsList.push({recommend});
                await user.save();
            }
            return res.status(201).json({stats:"success",data:recommend});

        }catch(err){
            console.log(err);
            return res.status(400).json({stats:"fail",message:"Invalid data sent"});
        }
        
    },


    //In progress
    update_recommendation: (req, res) => {
        res.status(500).json({status:"fail",message:"route in progess"});  
    },

    //In progress - need to delete from the user as well
    delete_recommendation: async(req, res) => {
        try{
            const {placeId,userName} = req.body;
            let user = await User.findOne({userName});
            if(!user) return res.status(404).json({stats:"fail",message:"לא קיים משתמש כזה"});
            
            await Recommendation.findOneAndDelete({placeId,userName:user},
                async (err,doc)=>{
                    if(err) return res.status(400).json({stats:"fail",message:"Invalid data sent"}); 
                    res.status(204).json({status:"sucess",data:null});
                });
            }catch(err){
            console.log(err);
            return res.status(400).json({stats:"fail",message:"Invalid data sent"});   
        }
    }
};