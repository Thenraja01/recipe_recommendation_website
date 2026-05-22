const Restaurant = require('../models/restaurant.model');

const seedData = [
    {
        name: 'Spice Garden Hotel',
        tagline: 'Authentic South Indian flavors',
        cuisine: 'South Indian',
        rating: 4.6,
        deliveryTime: 25,
        deliveryFee: 1.99,
        minOrder: 8,
        offer: '40% OFF up to ₹80',
        popular: true,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
        location: 'MG Road',
        menuItems: [
            { title: 'Masala Dosa', description: 'Crispy dosa with potato filling', price: 6.99, category: 'breakfast', prepTime: 15, isVeg: true, image: 'https://images.unsplash.com/photo-1630383249898-424b4d110aee?w=400' },
            { title: 'Chicken Biryani', description: 'Aromatic basmati rice with spiced chicken', price: 12.99, category: 'lunch', prepTime: 35, isVeg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' }
        ]
    },
    {
        name: 'Urban Bites Kitchen',
        tagline: 'Fast casual like Swiggy favorites',
        cuisine: 'Continental',
        rating: 4.4,
        deliveryTime: 20,
        deliveryFee: 2.49,
        minOrder: 12,
        offer: 'Free delivery on ₹199+',
        popular: true,
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600',
        location: 'Tech Park',
        menuItems: [
            { title: 'Gourmet Beef Burger', description: 'Angus patty with special sauce', price: 18.50, category: 'lunch', prepTime: 25, isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
            { title: 'Caesar Salad Bowl', description: 'Fresh greens with parmesan', price: 11.99, category: 'lunch', prepTime: 12, isVeg: true, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400' }
        ]
    },
    {
        name: 'Ocean Pearl Restaurant',
        tagline: 'Premium seafood & grills',
        cuisine: 'Seafood',
        rating: 4.8,
        deliveryTime: 35,
        deliveryFee: 3.99,
        minOrder: 20,
        offer: 'Buy 1 Get 1 on appetizers',
        popular: false,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600',
        location: 'Marina Bay',
        menuItems: [
            { title: 'Pan-Seared Salmon', description: 'Atlantic salmon with herbs', price: 24.00, category: 'dinner', prepTime: 22, isVeg: false, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
            { title: 'Grilled Prawns', description: 'Tiger prawns with garlic butter', price: 26.50, category: 'dinner', prepTime: 28, isVeg: false, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400' }
        ]
    },
    {
        name: 'Green Leaf Café',
        tagline: 'Healthy vegan & vegetarian',
        cuisine: 'Vegan',
        rating: 4.3,
        deliveryTime: 18,
        deliveryFee: 0.99,
        minOrder: 6,
        offer: '20% off first order',
        popular: true,
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
        location: 'Green Valley',
        menuItems: [
            { title: 'Vegan Tomato Soup', description: 'Roasted tomato with basil', price: 9.99, category: 'soups', prepTime: 15, isVeg: true, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
            { title: 'Avocado Buddha Bowl', description: 'Quinoa, avocado, tahini', price: 14.50, category: 'lunch', prepTime: 12, isVeg: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' }
        ]
    },
    {
        name: 'Royal Mughal Palace',
        tagline: 'North Indian & Mughlai specials',
        cuisine: 'North Indian',
        rating: 4.5,
        deliveryTime: 30,
        deliveryFee: 2.99,
        minOrder: 15,
        offer: 'Combo meals from ₹149',
        popular: false,
        image: 'https://images.unsplash.com/photo-1600891964094-82a06b0a0df0?w=600',
        location: 'Old City',
        menuItems: [
            { title: 'Butter Chicken', description: 'Creamy tomato gravy', price: 15.99, category: 'dinner', prepTime: 30, isVeg: false, image: 'https://images.unsplash.com/photo-1603894584371-3a076f477155?w=400' },
            { title: 'Paneer Tikka', description: 'Char-grilled cottage cheese', price: 11.50, category: 'dinner', prepTime: 20, isVeg: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' }
        ]
    },
    {
        name: 'Sunrise Breakfast Inn',
        tagline: 'Morning combos & coffee',
        cuisine: 'Breakfast',
        rating: 4.2,
        deliveryTime: 15,
        deliveryFee: 1.49,
        minOrder: 5,
        offer: 'Free coffee with breakfast',
        popular: true,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600',
        location: 'Station Road',
        menuItems: [
            { title: 'Spicy Avocado Toast', description: 'Sourdough with chili flakes', price: 12.99, category: 'breakfast', prepTime: 10, isVeg: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400' },
            { title: 'Classic Pancakes', description: 'Maple syrup stack', price: 8.99, category: 'breakfast', prepTime: 15, isVeg: true, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=400' }
        ]
    }
];

async function seedRestaurants() {
    const count = await Restaurant.countDocuments();
    if (count > 0) return;
    await Restaurant.insertMany(seedData);
    console.log('Restaurant seed data inserted');
}

module.exports = seedRestaurants;
