const express = require('express'),
    recommendationsController = require('./../Controllers/recommendationsController'),
    router = express.Router();


router.route('/')
    .get(recommendationsController.read_recommendations)
    .post(recommendationsController.create_recommendation);


router.route('/pid')
    .put(recommendationsController.update_recommendation)
    .delete(recommendationsController.delete_recommendation);

module.exports = router;