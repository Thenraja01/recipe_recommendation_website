const express = require('express');
const router = express.Router();
const {
    getRestaurants,
    getRestaurantById,
    getRecommendations,
    updatePreferences
} = require('../controllers/restaurant.controller');
const optionalAuth = require('../middlewares/optionalAuth.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', getRestaurants);
router.get('/recommendations', optionalAuth, getRecommendations);
router.get('/:id', getRestaurantById);
router.put('/preferences', authMiddleware, updatePreferences);

module.exports = router;
