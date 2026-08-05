const prisma = require("../config/prisma");
const nutritionService = require('../services/nutrition.service');

exports.createRecipe = async (req, res) => {
  try {
    const { title, ingredients = [], instructions, prepTime, servings, difficulty } = req.body;

    // Get nutrition information
    const nutritionData = await nutritionService.getNutritionInfo({ ingredients });

    const recipe = await prisma.recipe.create({
      data: {
        title,
        instructions,
        prepTime: parseInt(prepTime) || 0,
        servings: parseInt(servings) || 1,
        difficulty,
        creatorId: req.user.id,
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        carbs: nutritionData.carbs,
        fat: nutritionData.fat,
        fiber: nutritionData.fiber,
        sugar: nutritionData.sugar,
        sodium: nutritionData.sodium,
        cholesterol: nutritionData.cholesterol,
        saturatedFat: nutritionData.saturatedFat,
        transFat: nutritionData.transFat,
        vitaminA: nutritionData.vitaminA,
        vitaminC: nutritionData.vitaminC,
        calcium: nutritionData.calcium,
        iron: nutritionData.iron,
        healthLabels: nutritionData.healthLabels,
        dietLabels: nutritionData.dietLabels,
        allergens: nutritionData.allergens,
        ingredients: {
          create: Array.isArray(ingredients) ? ingredients.map((ing) => ({ name: typeof ing === 'object' ? ing.name : ing })) : [],
        },
      },
      include: {
        creator: { select: { id: true, username: true, avatar: true } },
        ingredients: true,
      },
    });

    res.status(201).json({ success: true, message: "Recipe created successfully", recipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const { search } = req.query;
    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { instructions: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        creator: { select: { id: true, username: true, avatar: true } },
        ingredients: true,
      },
    });

    res.json({ success: true, recipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: req.params.id },
      include: {
        creator: { select: { id: true, username: true, avatar: true } },
        ingredients: true,
      },
    });

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    res.json({ success: true, recipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({ where: { id: req.params.id } });

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    if (recipe.creatorId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { ingredients, title, instructions, prepTime, servings, difficulty } = req.body;

    const updated = await prisma.recipe.update({
      where: { id: req.params.id },
      data: {
        title,
        instructions,
        prepTime: prepTime !== undefined ? parseInt(prepTime) : undefined,
        servings: servings !== undefined ? parseInt(servings) : undefined,
        difficulty,
        ...(Array.isArray(ingredients) && {
          ingredients: {
            deleteMany: {},
            create: ingredients.map((name) => ({ name })),
          },
        }),
      },
      include: {
        creator: { select: { id: true, username: true, avatar: true } },
        ingredients: true,
      },
    });

    res.json({ success: true, message: "Recipe updated successfully", recipe: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({ where: { id: req.params.id } });

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    if (recipe.creatorId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await prisma.recipe.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: "Recipe deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        preferences: { include: { cuisines: true } }
      }
    });

    let where = {};
    
    if (user?.preferences?.cuisines?.length > 0) {
      const cuisineNames = user.preferences.cuisines.map(c => c.cuisine);
      where = {
        title: { contains: cuisineNames[0], mode: 'insensitive' }
      };
    }

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        creator: { select: { id: true, username: true, avatar: true } },
        ingredients: true,
      },
    });

    res.json({ success: true, recipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.searchByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.query;
    
    if (!ingredients) {
      return res.status(400).json({ success: false, message: 'Ingredients query parameter is required' });
    }

    const ingredientList = ingredients.split(',').map(i => i.trim().toLowerCase());
    
    const recipes = await prisma.recipe.findMany({
      include: {
        creator: { select: { id: true, username: true, avatar: true } },
        ingredients: true,
      },
    });

    const filtered = recipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
      const matchCount = ingredientList.filter(ing => 
        recipeIngredients.some(ri => ri.includes(ing) || ing.includes(ri))
      ).length;
      return matchCount > 0;
    });

    const sorted = filtered.sort((a, b) => {
      const aMatches = ingredientList.filter(ing => 
        a.ingredients.map(i => i.name.toLowerCase()).some(ri => ri.includes(ing) || ing.includes(ri))
      ).length;
      const bMatches = ingredientList.filter(ing => 
        b.ingredients.map(i => i.name.toLowerCase()).some(ri => ri.includes(ing) || ing.includes(ri))
      ).length;
      return bMatches - aMatches;
    });

    res.json({ success: true, recipes: sorted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
