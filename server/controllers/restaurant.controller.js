const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');

function scoreRestaurant(restaurant, preferences) {
    let score = restaurant.rating * 10;
    if (restaurant.popular) score += 5;
    if (restaurant.offer) score += 3;
    score -= restaurant.deliveryTime * 0.05;

    if (!preferences) return score;

    const cuisines = preferences.preferredCuisines || [];
    if (cuisines.length && cuisines.some(c =>
        restaurant.cuisine.toLowerCase().includes(c.toLowerCase()) ||
        c.toLowerCase().includes(restaurant.cuisine.toLowerCase())
    )) {
        score += 15;
    }

    const dietary = preferences.dietary || 'any';
    if (dietary === 'veg' || dietary === 'vegan') {
        const hasVeg = restaurant.menuItems?.some(m => m.isVeg);
        if (hasVeg) score += 8;
        if (dietary === 'vegan' && restaurant.cuisine.toLowerCase().includes('vegan')) {
            score += 12;
        }
    }

    const maxDelivery = preferences.maxDeliveryMinutes;
    if (maxDelivery && restaurant.deliveryTime <= maxDelivery) {
        score += 6;
    }

    return score;
}

exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().sort({ rating: -1 });
        res.status(200).json({ restaurants });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch restaurants', error: err.message });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json({ restaurant });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch restaurant', error: err.message });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        let preferences = null;
        let userType = 'guest';

        if (req.user?.id) {
            const user = await User.findById(req.user.id).select('preferences username');
            if (user) {
                preferences = user.preferences;
                userType = 'member';
            }
        } else if (req.query.preferences) {
            try {
                preferences = JSON.parse(req.query.preferences);
            } catch {
                preferences = null;
            }
        }

        const ranked = restaurants
            .map(r => ({
                restaurant: r,
                score: scoreRestaurant(r, preferences)
            }))
            .sort((a, b) => b.score - a.score)
            .map(item => ({
                ...item.restaurant.toObject(),
                matchScore: Math.round(item.score)
            }));

        res.status(200).json({
            restaurants: ranked,
            userType,
            personalized: Boolean(preferences)
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to get recommendations', error: err.message });
    }
};

exports.updatePreferences = async (req, res) => {
    try {
        const { preferredCuisines, dietary, maxDeliveryMinutes } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                preferences: {
                    preferredCuisines: preferredCuisines || [],
                    dietary: dietary || 'any',
                    maxDeliveryMinutes: maxDeliveryMinutes || 45
                }
            },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: 'Preferences updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update preferences', error: err.message });
    }
};
