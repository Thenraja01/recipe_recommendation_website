const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, default: 'main' },
    image: { type: String, default: '' },
    prepTime: { type: Number, default: 20 },
    isVeg: { type: Boolean, default: true }
}, { _id: true });

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    deliveryTime: { type: Number, default: 30 },
    deliveryFee: { type: Number, default: 2.99 },
    minOrder: { type: Number, default: 10 },
    offer: { type: String, default: '' },
    image: { type: String, default: '' },
    location: { type: String, default: 'Downtown' },
    menuItems: [menuItemSchema],
    popular: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
