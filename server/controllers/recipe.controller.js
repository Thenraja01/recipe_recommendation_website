const prisma = require("../config/prisma");

// =======================
// CREATE RECIPE
// =======================
exports.createRecipe = async (req, res) => {
  try {
    const {
      title,
      ingredients = [],
      instructions,
      prepTime,
      servings,
      difficulty,
    } = req.body;

    const recipe = await prisma.recipe.create({
      data: {
        title,
        instructions,
        prepTime,
        servings,
        difficulty,

        creatorId: req.user.id,

        ingredients: {
          create: Array.isArray(ingredients)
            ? ingredients.map((name) => ({
                name,
              }))
            : [],
        },
      },

      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        ingredients: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// =======================
// GET ALL RECIPES
// =======================
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },

        ingredients: true,
      },
    });

    res.json({
      success: true,
      recipes,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// =======================
// GET SINGLE RECIPE
// =======================
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: Number(req.params.id),
      },

      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },

        ingredients: true,
      },
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.json({
      success: true,
      recipe,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// =======================
// UPDATE RECIPE
// =======================
exports.updateRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    if (recipe.creatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      ingredients,
      title,
      instructions,
      prepTime,
      servings,
      difficulty,
    } = req.body;

    const updated = await prisma.recipe.update({
      where: {
        id: recipeId,
      },

      data: {
        title,
        instructions,
        prepTime,
        servings,
        difficulty,

        ...(Array.isArray(ingredients) && {
          ingredients: {
            deleteMany: {},

            create: ingredients.map((name) => ({
              name,
            })),
          },
        }),
      },

      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },

        ingredients: true,
      },
    });

    res.json({
      success: true,
      message: "Recipe updated successfully",
      recipe: updated,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// =======================
// DELETE RECIPE
// =======================
exports.deleteRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    if (recipe.creatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await prisma.recipe.delete({
      where: {
        id: recipeId,
      },
    });

    res.json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};