const express = require('express'),
    FriendsController = require('./../Controllers/friendsController'),
    authController = require('../Controllers/authController');
    router = express.Router();


router.route('/')
    .post(authController.protect,FriendsController.add_friend)         //Add a new friend to the list
    .put(authController.protect,FriendsController.update_friend)      //Change friend's "reliabillty"
    .delete(authController.protect,FriendsController.delete_friend);  //Delete a friend from the list

    
module.exports = router;