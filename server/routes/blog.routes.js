const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, aiAssist } = require('../controllers/blog.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// AI Assist route (protected)
router.post('/ai-assist', authMiddleware, aiAssist);

// Protected routes
router.post('/', authMiddleware, createBlog);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
