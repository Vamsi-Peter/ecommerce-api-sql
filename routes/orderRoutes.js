const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const { placeOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');

// ✅ Customer places an order
router.post('/', auth, placeOrder);

// 📦 Customer views their own orders
router.get('/', auth, getMyOrders);

// 🔐 Admin views all orders
router.get('/all', auth, admin, getAllOrders);

module.exports = router;

