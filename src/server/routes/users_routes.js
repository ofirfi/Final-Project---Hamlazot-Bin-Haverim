const express = require('express'),
    usersController = require('./../Controllers/usersController'),
    router = express.Router();


router.route('/')
    .get(usersController.read_user)
    .put(usersController.update_user)
    .delete(usersController.delete_user);

    
module.exports = router;