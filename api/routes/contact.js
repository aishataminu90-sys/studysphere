const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


// POST /contact
// Saves a contact form message to the database
// Public route - any visitor can send a message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate all fields are present
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are all required' });
    }

    // Basic email format check
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Message must be at least 10 characters
    if (message.trim().length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters' });
    }

    const contactMessage = new ContactMessage({ name, email, message });
    await contactMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /contact
// Returns all contact messages — admin only
// Each message includes this admin's personal status
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    // For each message, find this admin's status or default to 'New'
    const adminId = req.user._id.toString();

    const messagesWithStatus = messages.map(msg => {
      const adminEntry = msg.adminStatuses.find(
        s => s.admin.toString() === adminId
      );
      return {
        _id: msg._id,
        name: msg.name,
        email: msg.email,
        message: msg.message,
        createdAt: msg.createdAt,
        // This admin's personal status for this message
        myStatus: adminEntry ? adminEntry.status : 'New'
      };
    });

    res.status(200).json(messagesWithStatus);

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// PATCH /contact/:id/status
// Admin updates their personal status on a message
// Status can be: New, In Progress, Closed
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'In Progress', 'Closed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be New, In Progress, or Closed' });
    }

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const adminId = req.user._id.toString();

    // Check if this admin already has a status entry for this message
    const existingEntry = message.adminStatuses.find(
      s => s.admin.toString() === adminId
    );

    if (existingEntry) {
      // Update the existing entry
      existingEntry.status = status;
    } else {
      // Create a new entry for this admin
      message.adminStatuses.push({ admin: adminId, status });
    }

    await message.save();

    res.status(200).json({ message: 'Status updated', status });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// DELETE /contact/:id
// Admin permanently deletes a message
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    await message.deleteOne();
    res.status(200).json({ message: 'Message deleted' });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;