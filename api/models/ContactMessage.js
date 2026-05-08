const mongoose = require('mongoose');

// Schema for contact form messages sent by users
const contactMessageSchema = new mongoose.Schema({

  // Full name entered in the contact form
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Email address entered in the contact form
  email: {
    type: String,
    required: true,
    trim: true
  },

  // The message body
  message: {
    type: String,
    required: true,
    trim: true
  },

  // Per-admin status tracking
  // Each admin can set their own status on a message
  // so the same message can be 'In Progress' for one admin and 'New' for another
  // This prevents two admins answering the same query
  adminStatuses: [
    {
      // Which admin set this status
      admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      // The status this admin has set
      status: {
        type: String,
        enum: ['New', 'In Progress', 'Closed'],
        default: 'New'
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);