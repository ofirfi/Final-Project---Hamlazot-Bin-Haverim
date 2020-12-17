const express = require('express'),
    FriendsController = require('./../Controllers/friendsController'),
    router = express.Router();


router.route('/')
    .get(FriendsController.get_friends)         //get Friends List
    .post(FriendsController.add_friend)         //Add a new friend to the list
    .put(FriendsController.update_friend)      //Change friend's "reliabillty"
    .delete(FriendsController.delete_friend);  //Delete a friend from the list

    
module.exports = router;