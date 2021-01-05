const express = require('express'),
    RecommendationsController = require('./../Controllers/recommendationsController'),
    authController = require('../Controllers/authController'),
    router = express.Router();


router.route('/')
    .get(authController.protect,RecommendationsController.getRecommendations)
    .post(authController.protect,RecommendationsController.create_recommendation)
    .put(authController.protect,RecommendationsController.update_recommendation)
    .delete(authController.protect,RecommendationsController.delete_recommendation);
    

module.exports = router;