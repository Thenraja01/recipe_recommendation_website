const prisma = require("../config/prisma");

exports.createRecipe = async (req, res) => {
  try {
    const { title, ingredients = [], instructions, prepTime, servings, difficulty } = req.body;

    const recipe = await prisma.recipe.create({
      data: {
        title,
        instructions,
        prepTime: parseInt(prepTime) || 0,
        servings: parseInt(servings) || 1,
        difficulty,
        creatorId: req.user.id,
        ingredients: {
          create: Array.isArray(ingredients) ? ingredients.map((name) => ({ name })) : [],
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
