const mongoose = require('mongoose');

// Schema for a personal reminder/task
const reminderSchema = new mongoose.Schema({

    // Title of the reminder e.g. "Study Chapter 4"
    title: {
        type: String,
        required: true,
        trim: true
    },

    // Optional extra detail
    description: {
        type: String,
        trim: true
    },

    // Due date for the reminder
    dueDate: {
        type: Date,
        required: true
    },

    // Whether the task has been completed
    completed: {
        type: Boolean,
        default: false
    },

    // Which user this reminder belongs to
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);