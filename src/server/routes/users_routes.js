const express = require('express'),
    FriendsRoute = require('./friends_routes'),
    UsersController = require('./../Controllers/usersController'),
    router = express.Router();


router.route('/')
    .post(UsersController.get_profile)
    .delete(UsersController.delete_user);

router.use('/friends',FriendsRoute);
    
module.exports = router;