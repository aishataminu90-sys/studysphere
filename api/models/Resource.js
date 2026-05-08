const mongoose = require('mongoose');

// Schema for study resources uploaded by students
const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  module: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  // Reference to the user who uploaded the resource
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Array of user IDs who saved/bookmarked this resource
  savedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  // Array of individual ratings — one per user
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      value: {
        type: Number,
        min: 1,
        max: 5
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);`1`