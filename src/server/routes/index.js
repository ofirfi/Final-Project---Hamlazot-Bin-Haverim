const express = require('express'),
    authController = require('../Controllers/authController'),
    userRoutes = require('./users_routes'),
    recommendationRoutes = require('./recommendations_routes'),
    auth = require('./authentications._routes'),
    placeRoutes = require('./places_routes'),
    router = express.Router(),
    AppError = require('../utils/appError');


    
router.get('/', (req, res, next) => {
    res.status(200).json({ message: 'ברוכים הבאים להמלצות בין חברים' });
});


router
    .use('/auth', auth)   //login+registration 
    .use(authController.protect)
    .use('/users', userRoutes) //Read,Update and Delete
    .use('/recommendations', recommendationRoutes) //
    .use('/place', placeRoutes);



router.all('*', (req, res, next) => {
    const err = new Error(`cant find ${req.originalUrl} on this server!`);
    err.status = "fail";
    err.statusCode = 404;

    next(new AppError(`cant find ${req.originalUrl} on this server!`, 404));
})

module.exports = router;