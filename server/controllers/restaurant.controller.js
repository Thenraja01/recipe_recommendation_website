const prisma = require('../config/prisma');

function parsePositiveNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function buildRestaurantWhere(query = {}) {
    const where = {};

    if (query.cuisine) {
        where.cuisine = {
            contains: String(query.cuisine),
            mode: 'insensitive'
        };
    }

    if (query.search) {
        where.OR = [
            { name: { contains: String(query.search), mode: 'insensitive' } },
            { cuisine: { contains: String(query.search), mode: 'insensitive' } },
            { location: { contains: String(query.search), mode: 'insensitive' } }
        ];
    }

    if (query.popular !== undefined) {
        where.popular = String(query.popular).toLowerCase() === 'true';
    }

    const maxDeliveryTime = parsePositiveNumber(query.maxDeliveryTime || query.maxDeliveryMinutes);
    if (maxDeliveryTime) {
        where.deliveryTime = { lte: maxDeliveryTime };
    }

    return where;
}

exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await prisma.restaurant.findMany({
            where: buildRestaurantWhere(req.query),
            include: {
                menuItems: true
            },
            orderBy: [
                { popular: 'desc' },
                { rating: 'desc' },
                { deliveryTime: 'asc' }
            ]
        });

        return res.json({ restaurants });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: req.params.id },
            include: {
                menuItems: true
            }
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        return res.json({ restaurant });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        let preference = null;

        if (req.user?.id) {
            preference = await prisma.userPreference.findUnique({
                where: { userId: req.user.id },
                include: { cuisines: true }
            });
        }

        const preferredCuisines = preference?.cuisines?.map((item) => item.cuisine) || [];
        const maxDeliveryMinutes = preference?.maxDeliveryMinutes;
        const dietary = preference?.dietary;

        const where = {};
        if (preferredCuisines.length) {
            where.cuisine = { in: preferredCuisines };
        }
        if (maxDeliveryMinutes) {
            where.deliveryTime = { lte: maxDeliveryMinutes };
        }
        if (dietary === 'VEG' || dietary === 'VEGAN') {
            where.menuItems = {
                some: { isVeg: true }
            };
        }

        const restaurants = await prisma.restaurant.findMany({
            where,
            include: {
                menuItems: true
            },
            orderBy: [
                { rating: 'desc' },
                { popular: 'desc' },
                { deliveryTime: 'asc' }
            ],
            take: 10
        });

        return res.json({ restaurants });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.updatePreferences = async (req, res) => {
    const userId = req.user?.id;
    const { dietary, maxDeliveryMinutes, cuisines = [] } = req.body || {};

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const preference = await prisma.userPreference.upsert({
            where: { userId },
            create: {
                userId,
                dietary,
                maxDeliveryMinutes,
                cuisines: {
                    create: cuisines.map((cuisine) => ({ cuisine }))
                }
            },
            update: {
                dietary,
                maxDeliveryMinutes,
                cuisines: {
                    deleteMany: {},
                    create: cuisines.map((cuisine) => ({ cuisine }))
                }
            },
            include: {
                cuisines: true
            }
        });

        return res.json({
            message: 'Preferences updated',
            preference
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
