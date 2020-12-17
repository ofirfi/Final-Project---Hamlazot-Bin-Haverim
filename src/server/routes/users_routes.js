const express = require('express'),
    FriendsRoute = require('./friends_routes'),
    UsersController = require('./../Controllers/usersController'),
    router = express.Router();


router.route('/')
    .get(UsersController.read_user)
    .put(UsersController.update_user)
    .delete(UsersController.delete_user);

router.use('/friends',FriendsRoute);
    
module.exports = router;