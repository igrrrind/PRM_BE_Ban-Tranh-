const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
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
