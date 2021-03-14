const express = require('express'),
    Place = require('../controllers/placesController');
    router = express.Router(),


router.route('/search/:toSearch').get(Place.search_places);
router.route('/show/:placeId').get(Place.get_place);

module.exports = router;