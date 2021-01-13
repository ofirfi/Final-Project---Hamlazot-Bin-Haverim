const express = require('express'),
    userRoutes = require('./users_routes'),
    profileRoutes = require('./profile_routes'),
    recommendationRoutes = require('./recommendations_routes'),
    auth = require('./authentications._routes'),
    router = express.Router(),
    AppError = require('../utils/appError');
    

router.get('/', (req, res,next) => {
   res.status(200).json({message:'ברוכים הבאים להמלצות בין חברים'});
});


router
    .use('/profile',profileRoutes)
    .use('/users',userRoutes) //Read,Update and Delete
    .use('/recommendations',recommendationRoutes) //
    .use('/auth',auth);   //login+registration 

    
router.all('*',(req,res,next)=>{
    const err = new Error(`cant find ${req.originalUrl} on this server!`);
    err.status = "fail";
    err.statusCode = 404;

    next(new AppError(`cant find ${req.originalUrl} on this server!`,404));
})

module.exports = router;