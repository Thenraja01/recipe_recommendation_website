const express = require('express');
const router = express.Router();
const { createComment, getBlogComments, askAI, deleteComment } = require('../controllers/blogComment.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.get('/blog/:blogId', getBlogComments);
router.post('/', authMiddleware, createComment);
router.post('/ask-ai', authMiddleware, askAI);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
