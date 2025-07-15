const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

// ✅ Authenticated user required for all cart actions
router.post('/add', auth, cartController.addToCart);
router.get('/', auth, cartController.getCart);
router.put('/update/:id', auth, cartController.updateCartItem);
router.delete('/remove/:id', auth, cartController.removeFromCart);

module.exports = router;

