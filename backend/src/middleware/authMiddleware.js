const jwt = require('jsonwebtoken');

const extractToken = (req) => {
  const header = req.header('Authorization');
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  return null;
};

exports.auth = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: decoded.id }; // Ensure id is extracted
    console.log('Authenticated user ID:', req.user.id); // Debug log
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};