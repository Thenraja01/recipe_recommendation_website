const Recipe = require('../models/recipe.model');

// Create a new recipe
exports.createRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, prepTime, servings, difficulty } = req.body;

        const newRecipe = await Recipe.create({
            title,
            ingredients,
            instructions,
            prepTime,
            servings,
            difficulty,
            creator: req.user.id
        });

        res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    } catch (err) {
        console.error('Error creating recipe:', err);
        res.status(500).json({ message: 'Server error during recipe creation', error: err.message });
    }
};

// Get all recipes
exports.getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('creator', 'username avatar');
        res.status(200).json({ recipes });
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ message: 'Server error fetching recipes', error: err.message });
    }
};

// Get a single recipe
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('creator', 'username avatar');
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json({ recipe });
    } catch (err) {
         console.error('Error fetching recipe:', err);
        res.status(500).json({ message: 'Server error fetching recipe', error: err.message });
    }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if user is creator
        if (recipe.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
    } catch (err) {
        console.error('Error updating recipe:', err);
        res.status(500).json({ message: 'Server error while updating recipe', error: err.message });
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if user is creator
        if (recipe.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        console.error('Error deleting recipe:', err);
        res.status(500).json({ message: 'Server error deleting recipe', error: err.message });
    }
};
