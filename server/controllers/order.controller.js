const orders = new Map();

function money(value) {
    return Math.round(Number(value || 0) * 100) / 100;
}

function buildOrderTotals(items, deliveryFee = 0) {
    const subtotal = items.reduce((sum, item) => {
        return sum + money(item.price) * Number(item.quantity || 1);
    }, 0);
    const platformFee = items.length ? 4 : 0;
    const tax = subtotal * 0.05;
    const total = subtotal + money(deliveryFee) + platformFee + tax;

    return {
        subtotal: money(subtotal),
        deliveryFee: money(deliveryFee),
        platformFee: money(platformFee),
        tax: money(tax),
        total: money(total)
    };
}

exports.createOrder = async (req, res) => {
    const {
        restaurantId,
        restaurantName,
        deliveryAddress,
        phone,
        paymentMode = 'COD',
        deliveryFee = 0,
        items = []
    } = req.body || {};

    if (!restaurantId || !restaurantName) {
        return res.status(400).json({ message: 'Restaurant details are required' });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Add at least one item to place an order' });
    }

    if (!deliveryAddress || !String(deliveryAddress).trim()) {
        return res.status(400).json({ message: 'Delivery address is required' });
    }

    const normalizedItems = items.map((item) => ({
        id: String(item.id),
        title: String(item.title),
        price: money(item.price),
        quantity: Math.max(1, Number(item.quantity || 1)),
        image: item.image || null
    }));

    const order = {
        id: `ORD-${Date.now()}`,
        restaurantId,
        restaurantName,
        deliveryAddress: String(deliveryAddress).trim(),
        phone: phone ? String(phone).trim() : null,
        paymentMode,
        status: 'CONFIRMED',
        etaMinutes: 28,
        items: normalizedItems,
        totals: buildOrderTotals(normalizedItems, deliveryFee),
        createdAt: new Date().toISOString()
    };

    orders.set(order.id, order);

    return res.status(201).json({
        message: 'Order placed successfully',
        order
    });
};

exports.getOrderById = async (req, res) => {
    const order = orders.get(req.params.id);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ order });
};
