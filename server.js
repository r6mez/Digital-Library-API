require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const typeRoutes = require('./routes/typeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authorRoutes = require('./routes/authorRoutes');
const offerRoutes = require('./routes/offerRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const { setupSwaggerUI, getSwaggerSpec } = require('./controllers/swaggerController');
const { generalLimiter, authLimiter, adminLimiter } = require('./middleware/rateLimiterMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON bodies
app.use(express.json());

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Root route
app.get('/', (req, res) => { res.send('API is running...'); });

// Setup Swagger UI with custom middleware and options
setupSwaggerUI(app);

// Swagger JSON specification endpoint
app.get('/api-docs.json', getSwaggerSpec);

// API Routes
app.use('/auth', authLimiter, authRoutes);
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/types', typeRoutes);
app.use('/categories', categoryRoutes);
app.use('/authors', authorRoutes);
app.use('/offers', offerRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/transactions', transactionRoutes);
app.use('/statistics', adminLimiter, statisticsRoutes); 

// Connect to database and start the server only after a successful connection
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
