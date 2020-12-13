const express = require('express'),
    userRoutes = require('./users_routes'),
    recommendationRoutes = require('./recommendations_routes'),
    router = express.Router();
    

router.get('/', (req, res) => {
   res.status(200).json({message:'ברוכים הבאים להמלצות בין חברים'});
});

router.use('/users',userRoutes);
router.use('/recommendations',recommendationRoutes);

module.exports = router;