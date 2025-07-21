const express = require('express');
const serverless = require('serverless-http');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('../routes/user.routes');
const productRoutes = require('../routes/product.routes');
const categoryRoutes = require('../routes/category.routes');
const cartRoutes = require('../routes/cartitem.routes');
const cartItemRoutes = require('../routes/cartitem.routes');
const orderRoutes = require('../routes/order.routes');
const chatMessageRoutes = require('../routes/chatmessage.routes');
const storeLocationRoutes = require('../routes/storelocation.routes');
const authRoutes = require('../routes/auth.routes');
const vnpayRoutes = require('../routes/vnpay.routes');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Basic route
app.get('/', (req, res) => {
  res.send('Serverless Node API is running on Vercel!');
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/cartitems', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chatmessages', chatMessageRoutes);
app.use('/api/storelocations', storeLocationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vnpay', vnpayRoutes);

// Sequelize connection (optional, caution in serverless)
const db = require('../models');

const initializeDatabase = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    console.log('Database connected.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Initialize database only once in cold starts
initializeDatabase();

module.exports = app;
module.exports.handler = serverless(app);
