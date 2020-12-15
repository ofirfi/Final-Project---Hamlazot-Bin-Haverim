const express = require('express'),
    userRoutes = require('./users_routes'),
    recommendationRoutes = require('./recommendations_routes'),
    auth = require('./authentications._routes'),
    router = express.Router();
    

router.get('/', (req, res) => {
   res.status(200).json({message:'ברוכים הבאים להמלצות בין חברים'});
});


router
    .use('/users',userRoutes) //Read,Update and Delete
    .use('/recommendations',recommendationRoutes) //
    .use('/auth',auth);   //login+registration 

module.exports = router;