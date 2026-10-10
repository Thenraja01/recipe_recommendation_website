const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  addBlogFavorite,
  removeBlogFavorite
} = require('../controllers/favorite.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.use(authMiddleware);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:recipeId', removeFavorite);

// Blog favorites endpoints
router.post('/blog', addBlogFavorite);
router.delete('/blog/:blogId', removeBlogFavorite);

module.exports = router;
