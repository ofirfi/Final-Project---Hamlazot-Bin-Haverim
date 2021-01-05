const express = require('express'),
    authController = require('../Controllers/authController'),
    router = express.Router();

router
    .post('/login',authController.login)
    .post('/signup',authController.register)
    .put('/changePassword',authController.protect,authController.update_password);

module.exports = router;