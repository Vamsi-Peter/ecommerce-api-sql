// server.js
const express = require('express');
const app = express();
const sequelize = require('./config/db');
require('dotenv').config({ path: './envfile' });

// 🧠 Import all models before associations
require('./models/User');
require('./models/Product');
require('./models/Cart');
require('./models/CartItem');
require('./models/Order');
require('./models/OrderItem');

// 🔗 Setup associations
require('./models/associations');

// ✅ Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ✅ Middlewares
app.use(express.json());

// ✅ Serve static frontend
app.use(express.static('public'));

// ✅ Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('✅ E-commerce API is working!');
});

// ✅ DB Connection + Model Sync
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to MySQL using Sequelize');
    return sequelize.sync({ alter: true }); // alter: true for dev only
  })
  .then(() => {
    console.log('✅ Models synced with database');
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB:', err);
  });

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
