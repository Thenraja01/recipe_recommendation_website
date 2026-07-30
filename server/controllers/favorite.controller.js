const prisma = require('../config/prisma');

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        recipe: {
          include: {
            ingredients: true,
            creator: { select: { id: true, username: true, avatar: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ favorites: favorites.map(f => f.recipe) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ message: 'recipeId is required' });
    }

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_recipeId: { userId: req.user.id, recipeId } }
    });

    if (existing) {
      return res.json({ message: 'Already in favorites' });
    }

    const favorite = await prisma.favorite.create({
      data: { userId: req.user.id, recipeId }
    });

    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const existing = await prisma.favorite.findUnique({
      where: { userId_recipeId: { userId: req.user.id, recipeId } }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    await prisma.favorite.delete({
      where: { userId_recipeId: { userId: req.user.id, recipeId } }
    });

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
