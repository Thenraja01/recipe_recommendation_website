const express = require('express');
const router = express.Router();
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, getRecommendations } = require('../controllers/recipe.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.get('/', getRecipes);
router.get('/recommendations/personalized', authMiddleware, getRecommendations);
router.get('/:id', getRecipeById);

// Protected routes
router.post('/', authMiddleware, createRecipe);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

module.exports = router;
