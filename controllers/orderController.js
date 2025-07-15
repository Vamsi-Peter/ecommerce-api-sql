const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const User = require('../models/User');

// ✅ Place a new order from cart
exports.placeOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({
      where: { UserId: userId },
      include: CartItem,
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total = 0;
    const orderItemsData = [];

    for (const item of cart.CartItems) {
      const product = await Product.findByPk(item.ProductId);
      if (!product) continue;

      total += product.price * item.quantity;
      orderItemsData.push({
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({ total, UserId: userId });

    const orderItems = await Promise.all(
      orderItemsData.map(data =>
        OrderItem.create({ ...data, OrderId: order.id })
      )
    );

    await CartItem.destroy({ where: { CartId: cart.id } });

    res.status(201).json({ message: 'Order placed successfully', order, orderItems });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};

// 📦 Get orders for current user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: OrderItem,
      order: [['createdAt', 'DESC']]
    });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// 🔐 Admin: Get all user orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem },
        { model: User, attributes: ['id', 'username', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all orders', error: err.message });
  }
};

