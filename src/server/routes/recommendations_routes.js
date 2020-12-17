const express = require('express'),
    RecommendationsController = require('./../Controllers/recommendationsController'),
    router = express.Router();


router.route('/')
    .get(RecommendationsController.getRecommendations)
    .post(RecommendationsController.create_recommendation)
    .put(RecommendationsController.update_recommendation)
    .delete(RecommendationsController.delete_recommendation);
    

module.exports = router;