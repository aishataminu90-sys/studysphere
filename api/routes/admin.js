const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// All admin routes require both auth and admin role
router.use(authMiddleware);
router.use(adminMiddleware);


// GET /admin/users
// Returns all registered users
router.get('/users', async (req, res) => {
  try {
    // Exclude passwords from the response
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// DELETE /admin/users/:id
// Admin removes a user account
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Prevent admin from deleting their own account
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// PATCH /admin/users/:id/make-admin
// Promotes a user to admin role
router.patch('/users/:id/make-admin', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: `${user.name} is now an admin` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// PATCH /admin/users/:id/remove-admin
// Removes admin role from a user
router.patch('/users/:id/remove-admin', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Prevent admin from removing their own admin role
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot remove your own admin role' });
    }

    user.role = 'user';
    await user.save();

    res.status(200).json({ message: `${user.name} is no longer an admin` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /admin/resources
// Returns all resources uploaded on the platform
router.get('/resources', async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// DELETE /admin/resources/:id
// Admin removes any resource from the platform
router.delete('/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    await resource.deleteOne();
    res.status(200).json({ message: 'Resource removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /admin/stats
// Returns quick summary stats for the admin dashboard header
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalResources] = await Promise.all([
      User.countDocuments(),
      Resource.countDocuments(),
    ]);

    res.status(200).json({ totalUsers, totalResources });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;