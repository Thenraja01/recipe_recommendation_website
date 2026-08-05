const express = require('express');
const router = express.Router();
const { 
  createRestaurant, 
  getRestaurants, 
  getRestaurantById, 
  updateRestaurant, 
  deleteRestaurant,
  createMenuItem,
  createMenuCategory
} = require('../controllers/restaurant.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Protected routes - restaurant owners
router.post('/', authMiddleware, createRestaurant);
router.put('/:id', authMiddleware, updateRestaurant);
router.delete('/:id', authMiddleware, deleteRestaurant);
router.post('/:id/menu-items', authMiddleware, createMenuItem);
router.post('/:id/categories', authMiddleware, createMenuCategory);

module.exports = router;
