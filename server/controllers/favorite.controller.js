const prisma = require('../config/prisma');

exports.getFavorites = async (req, res) => {
  try {
    const blogFavs = await prisma.blogFavorite.findMany({
      where: { userId: req.user.id },
      include: {
        blog: {
          include: {
            author: { select: { id: true, username: true, avatar: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const blogs = blogFavs
      .filter(f => f.blog)
      .map(f => ({ ...f.blog, blogId: f.blog.id }));

    res.json({
      blogs,
      favorites: blogs
    });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const blogId = req.body.blogId || req.body.recipeId;

    if (!blogId) {
      return res.status(400).json({ message: 'blogId is required' });
    }

    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const existing = await prisma.blogFavorite.findUnique({
      where: { userId_blogId: { userId: req.user.id, blogId } }
    });

    if (existing) {
      return res.json({ message: 'Already in favorites', isFavorited: true });
    }

    const favorite = await prisma.blogFavorite.create({
      data: { userId: req.user.id, blogId }
    });

    res.status(201).json({ message: 'Added to favorites', favorite, isFavorited: true });
  } catch (err) {
    console.error('Error adding favorite:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const blogId = req.params.blogId || req.params.recipeId;

    const existing = await prisma.blogFavorite.findUnique({
      where: { userId_blogId: { userId: req.user.id, blogId } }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    await prisma.blogFavorite.delete({
      where: { userId_blogId: { userId: req.user.id, blogId } }
    });

    res.json({ message: 'Removed from favorites', isFavorited: false });
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.addBlogFavorite = exports.addFavorite;
exports.removeBlogFavorite = exports.removeFavorite;
