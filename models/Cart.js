const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cart = sequelize.define('Cart', {
  // No extra fields needed here
});

module.exports = Cart;

