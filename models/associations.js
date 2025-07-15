const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// 🛒 Cart Relationships

// 1 user → 1 cart
User.hasOne(Cart);
Cart.belongsTo(User);

// 1 cart → many cart items
Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

// 1 product → many cart items
Product.hasMany(CartItem);
CartItem.belongsTo(Product);

// 🧾 Order Relationships

// 1 user → many orders
User.hasMany(Order);
Order.belongsTo(User);

// 1 order → many order items
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

