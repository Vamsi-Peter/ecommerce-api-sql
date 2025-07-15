// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './envfile' }); // Ensure .env is loaded

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user info (id, role) to request
    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

