const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const typeRoutes = require('./routes/typeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const offerRoutes = require('./routes/offerRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const transactionRoutes = require('./routes/transactionRoutes');


const { swaggerUi, swaggerSpec } = require("./config/swagger");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/types', typeRoutes);
app.use('/categories', categoryRoutes);
app.use('/offers', offerRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
