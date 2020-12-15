const express = require('express'),
    recommendationsController = require('./../Controllers/recommendationsController'),
    router = express.Router();


router.route('/')
    .get(recommendationsController.getRecommendations)
    .post(recommendationsController.create_recommendation)
    .put(recommendationsController.update_recommendation)
    .delete(recommendationsController.delete_recommendation);
    

module.exports = router;