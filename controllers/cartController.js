const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const User = require('../models/User');

// 🔄 Ensure user has a cart
const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { UserId: userId } });
  if (!cart) {
    cart = await Cart.create({ UserId: userId });
  }
  return cart;
};

// 🛒 Add item to cart
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const cart = await findOrCreateCart(userId);

    const existingItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.json({ message: 'Cart updated', item: existingItem });
    }

    const item = await CartItem.create({
      CartId: cart.id,
      ProductId: productId,
      quantity,
    });

    res.status(201).json({ message: 'Item added to cart', item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add item', error: err.message });
  }
};

// 👀 Get cart items
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await findOrCreateCart(userId);

    const items = await CartItem.findAll({
      where: { CartId: cart.id },
      include: [Product],
    });

    res.json({ cartItems: items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};

// 🔄 Update quantity
exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const item = await CartItem.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    await item.save();

    res.json({ message: 'Quantity updated', item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item', error: err.message });
  }
};

// ❌ Remove from cart
exports.removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await CartItem.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
};

