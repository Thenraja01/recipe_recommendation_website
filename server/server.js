const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const config = require('./config/env');
const prisma = require('./config/prisma');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(cookieParser());

const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL connected via Prisma');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};
connectDatabase();

app.get('/', (req, res) => {
  res.json({ message: 'Recipe Recommendation API is running...', environment: config.nodeEnv, version: '1.0.0' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/blogs', require('./routes/blog.routes'));
app.use('/api/comments', require('./routes/blogComment.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/favorites', require('./routes/favorite.routes'));
app.use('/api/restaurants', require('./routes/restaurant.routes'));
app.use('/api/orders', require('./routes/order.routes'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ message: config.isDev ? err.message : 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
});
