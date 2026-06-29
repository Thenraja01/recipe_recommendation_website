const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const prisma = require('./config/prisma');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN, // Vite default port
    credentials: true
}));
app.use(cookieParser());

// Database connection
const PORT = process.env.PORT || 5000;

const databasestarted=async ()=>{
    try {
         await prisma.$connect();
        console.log(
            "PostgreSQL connected Prisma"
        );    
    } catch (error) {
        console.error(
            "Database connection failed:",
            error
        );
        process.exit(1);
    }
}
databasestarted()
// Basic route
app.get('/', (req, res) => {
    res.send('Recipe Recommendation API is running...');
});

// Import and use routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/recipes', require('./routes/recipe.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/blogs', require('./routes/blog.routes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
