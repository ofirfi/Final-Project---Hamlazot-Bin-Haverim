const express = require('express'),
    authController = require('../Controllers/authController'),
    router = express.Router();

router
    .post('/login',authController.login)
    .post('/signup',authController.register);

module.exports = router;