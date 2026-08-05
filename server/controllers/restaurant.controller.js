const prisma = require('../config/prisma');

exports.createRestaurant = async (req, res) => {
  try {
    const { name, description, image, address, phone, email, cuisineType, openingTime, closingTime } = req.body;
    const ownerId = req.user.id;

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        image,
        address,
        phone,
        email,
        cuisineType,
        openingTime,
        closingTime,
        ownerId
      },
      include: {
        owner: { select: { id: true, username: true, email: true } }
      }
    });

    res.status(201).json({ success: true, restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        owner: { select: { id: true, username: true } },
        menuItems: {
          where: { isAvailable: true },
          take: 3
        }
      },
      orderBy: { rating: 'desc' }
    });

    res.json({ success: true, restaurants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, username: true } },
        menuCategories: {
          include: {
            menuItems: {
              where: { isAvailable: true },
              orderBy: { name: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    res.json({ success: true, restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, address, phone, email, cuisineType, isOpen, openingTime, closingTime } = req.body;

    const restaurant = await prisma.restaurant.findUnique({ where: { id } });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updated = await prisma.restaurant.update({
      where: { id },
      data: {
        name,
        description,
        image,
        address,
        phone,
        email,
        cuisineType,
        isOpen,
        openingTime,
        closingTime
      },
      include: {
        owner: { select: { id: true, username: true } }
      }
    });

    res.json({ success: true, restaurant: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({ where: { id } });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await prisma.restaurant.delete({ where: { id } });

    res.json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { restaurantId, categoryId, name, description, image, price, isVegetarian, isVegan, isSpicy, preparationTime, calories, allergens } = req.body;

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId,
        categoryId,
        name,
        description,
        image,
        price: parseFloat(price),
        isVegetarian: isVegetarian || false,
        isVegan: isVegan || false,
        isSpicy: isSpicy || false,
        preparationTime,
        calories,
        allergens
      }
    });

    res.status(201).json({ success: true, menuItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createMenuCategory = async (req, res) => {
  try {
    const { restaurantId, name, description, order } = req.body;

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const category = await prisma.menuCategory.create({
      data: {
        restaurantId,
        name,
        description,
        order: order || 0
      }
    });

    res.status(201).json({ success: true, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
