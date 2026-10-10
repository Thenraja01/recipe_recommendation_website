const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, updateProfile, sendOtp, verifyOtp, updatePreferences, changePassword } = require('../controllers/auth.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);
router.put('/preferences', authMiddleware, updatePreferences);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
