const express = require('express'),
    authController = require('../Controllers/authController'),
    router = express.Router();

router
    .post('/login',authController.login)
    .post('/signup',authController.register)
    .post('/forgotPassword',authController.forgot_password)
    .put('/resetPassword/:token',authController.reset_password)
    .put('/changePassword',authController.protect,authController.update_password);

module.exports = router;