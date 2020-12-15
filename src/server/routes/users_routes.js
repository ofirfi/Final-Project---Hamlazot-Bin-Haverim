const express = require('express'),
    usersController = require('./../Controllers/usersController'),
    router = express.Router();

router.route('/')
    .get(usersController.read_users)
    .post(usersController.create_user);
    
router.route('/:id')
    .put(usersController.update_user)
    .delete(usersController.delete_user);



module.exports = router;