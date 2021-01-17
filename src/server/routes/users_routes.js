const express = require('express'),
    FriendsRoute = require('./friends_routes'),
    UsersController = require('./../Controllers/usersController'),
    authController = require('../Controllers/authController');
    router = express.Router();


router.route('/:userName')
    .get(authController.protect,UsersController.get_users_profile)

router.route('/:userName')
    .delete(authController.protect,UsersController.delete_user);

router.use('/friends',FriendsRoute);
    
module.exports = router;