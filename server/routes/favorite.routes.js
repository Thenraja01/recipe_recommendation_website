const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favorite.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.use(authMiddleware);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:recipeId', removeFavorite);

module.exports = router;
