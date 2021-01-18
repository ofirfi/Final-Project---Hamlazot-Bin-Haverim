const express = require('express'),
    UsersController = require('./../Controllers/usersController'),
    authController = require('../Controllers/authController');
    router = express.Router();


router.route('/')
     .get(authController.protect,UsersController.get_profile);

module.exports = router;