const express = require('express'),
    FriendsRoute = require('./friends_routes'),
    UsersController = require('./../Controllers/usersController'),
    authController = require('../Controllers/authController');
    router = express.Router();


router.route('/:userName')
    .post(authController.protect,UsersController.get_profile)
    .delete(authController.protect,UsersController.delete_user);

router.use('/friends',FriendsRoute);
    
module.exports = router;