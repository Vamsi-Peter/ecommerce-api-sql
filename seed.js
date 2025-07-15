// seed.js
const sequelize = require('./config/db');
const Product = require('./models/Product');

const seedProducts = async () => {
  try {
    await sequelize.sync({ force: false }); // Don't drop tables, just insert
    const products = [
      { name: "Smartphone", price: 20000, description: "Android phone", category: "Electronics" },
      { name: "Laptop", price: 55000, description: "i5, 8GB RAM", category: "Electronics" },
      { name: "T-Shirt", price: 500, description: "Cotton, Medium", category: "Clothing" },
      { name: "Shoes", price: 1200, description: "Running shoes", category: "Footwear" },
      { name: "Washing Machine", price: 25000, description: "6kg Front Load", category: "Appliances" },
    ];

    await Product.bulkCreate(products);
    console.log('✅ Sample products inserted');
    process.exit(); // end script
  } catch (err) {
    console.error('❌ Error inserting products:', err);
    process.exit(1);
  }
};

seedProducts();

