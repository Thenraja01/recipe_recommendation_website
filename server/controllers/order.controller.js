const prisma = require('../config/prisma');
const chefService = require('../services/chef.service');

exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, specialInstructions } = req.body;
    const userId = req.user.id;

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (!restaurant.isOpen) {
      return res.status(400).json({ success: false, message: 'Restaurant is currently closed' });
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ success: false, message: `Item ${item.menuItemId} not available` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions
      });
    }

    const order = await prisma.order.create({
      data: {
        restaurantId,
        userId,
        totalAmount,
        deliveryAddress,
        specialInstructions,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        orderItems: {
          create: orderItemsData
        }
      },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        restaurant: {
          include: {
            owner: { select: { id: true, username: true } }
          }
        },
        user: { select: { id: true, username: true, email: true } }
      }
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const orders = await prisma.order.findMany({
      where: { restaurantId },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { restaurant: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.restaurant.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.json({ success: true, order: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.askWaiter = async (req, res) => {
  try {
    const { restaurantId, question } = req.body;
    const userId = req.user.id;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        menuItems: {
          where: { isAvailable: true },
          include: {
            category: true
          }
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const menuText = restaurant.menuItems.map(item => 
      `${item.name} - $${item.price} (${item.category?.name || 'General'})${item.isVegetarian ? ' [Veg]' : ''}${item.isSpicy ? ' [Spicy]' : ''}`
    ).join('\n');

    const context = `
Restaurant: ${restaurant.name}
Cuisine Type: ${restaurant.cuisineType || 'Various'}
Description: ${restaurant.description || 'No description'}
Status: ${restaurant.isOpen ? 'Open' : 'Closed'}
Hours: ${restaurant.openingTime || 'N/A'} - ${restaurant.closingTime || 'N/A'}

Available Menu:
${menuText}
`;

    const systemPrompt = `You are a friendly virtual waiter for ${restaurant.name}. 
Your job is to recommend dishes, describe menu items, and assist with ordering.

Context:
${context}

User Question: ${question}

Provide helpful, friendly recommendations. If asked about ordering, guide them to the ordering interface. 
Return your response as a JSON object with this structure:
{
  "recommendation": "your main recommendation or answer",
  "dishes": ["dish1", "dish2"] (optional array of suggested dishes),
  "suggestion": "additional helpful tip"
}`;

    const response = await chefService.chat({
      userId,
      message: systemPrompt,
      mode: 'waiter'
    });

    res.json({ success: true, response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
