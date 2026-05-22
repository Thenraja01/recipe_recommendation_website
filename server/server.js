const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(cookieParser());

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe_db';

const seedRestaurants = require('./seed/restaurants.seed');

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        await seedRestaurants();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Recipe Recommendation API is running...');
});

// Import and use routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/recipes', require('./routes/recipe.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/restaurants', require('./routes/restaurant.routes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
