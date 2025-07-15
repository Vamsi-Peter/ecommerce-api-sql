const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // ✅ Middleware import

// 🟢 Public route – anyone (no token needed)
router.get('/', productController.getAllProducts);

// 🔒 Admin-only routes – require valid token and admin role
router.post(
  '/',
  authMiddleware,        // ✅ Validate token
  adminMiddleware,       // ✅ Check role = 'admin'
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  productController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

module.exports = router;

