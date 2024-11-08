// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the "Authorization" header

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
   
     // Attach the user ID from the token to req.user
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
