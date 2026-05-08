// adminMiddleware.js
// Protects admin-only routes
// Must be used AFTER authMiddleware so req.session.userId is guaranteed to exist

const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    // Look up the logged-in user to check their role
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Block anyone who is not an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Attach user to request so routes can use it
    req.user = user;
    next();

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = adminMiddleware;