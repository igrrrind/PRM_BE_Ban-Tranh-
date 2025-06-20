const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const cartItemRoutes = require('./routes/cartitem.routes');
const orderRoutes = require('./routes/order.routes');
const chatMessageRoutes = require('./routes/chatmessage.routes');
const storeLocationRoutes = require('./routes/storelocation.routes');
const db = require('./models');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
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

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync(); // Ensures models are synced (optional, can be removed if using migrations only)
    console.log('Database connected.');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
