const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = Order;

