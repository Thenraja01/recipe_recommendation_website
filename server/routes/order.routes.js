const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getUserOrders, 
  getRestaurantOrders, 
  updateOrderStatus,
  askWaiter
} = require('../controllers/order.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/restaurant/:restaurantId', authMiddleware, getRestaurantOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);
router.post('/ask-waiter', authMiddleware, askWaiter);

module.exports = router;
