const express = require('express'),
    FriendsController = require('./../Controllers/friendsController'),
    router = express.Router();


router.route('/')
    .post(FriendsController.add_friend)         //Add a new friend to the list
    .put(FriendsController.update_friend)      //Change friend's "reliabillty"
    .delete(FriendsController.delete_friend);  //Delete a friend from the list

router.route('/search/:userName')
    .post(FriendsController.search_users);

module.exports = router;