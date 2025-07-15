const Product = require('../models/Product');
const { Op } = require('sequelize');

// ✅ Create new product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

// ✅ Get all products (with pagination and search)
exports.getAllProducts = async (req, res) => {
  const { page = 1, limit = 5, search = '' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const products = await Product.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        }
      },
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      totalItems: products.count,
      totalPages: Math.ceil(products.count / limit),
      currentPage: parseInt(page),
      products: products.rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// ✅ Update product (admin only)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.update(req.body);
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

// ✅ Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};

