const express = require('express'),
    userRoutes = require('./users_routes'),
    recommendationRoutes = require('./recommendations_routes');

var router = express.Router();

router.get('/', (req, res) => {
   res.status(200).send('ברוכים הבאים להמלצות בין חברים');
});


router.get('/users', userRoutes.read_users);
router.post('/users', userRoutes.create_user);
router.put('/users/:id', userRoutes.update_user);
router.delete('/users/:id', userRoutes.delete_user);


router.get('/recommendation', recommendationRoutes.read_recommendations);
router.post('/recommendation', recommendationRoutes.create_recommendation);
router.put('/recommendation/:id', recommendationRoutes.update_recommendation);
router.delete('/recommendation/:id', recommendationRoutes.delete_recommendation);

module.exports = router;