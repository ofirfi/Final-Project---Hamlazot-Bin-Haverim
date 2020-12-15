const express = require('express'),
    authController = require('../Controllers/authController'),
    router = express.Router();

router
    .get('/',authController.logIn)
    .post('/',authController.register);

module.exports = router;