const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, sendOtp, verifyOtp } = require('../controllers/auth.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);

module.exports = router;
