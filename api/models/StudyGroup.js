const mongoose = require('mongoose');

// Schema for a study group
const studyGroupSchema = new mongoose.Schema({

    // Name of the study group e.g. "Web Dev Group"
    name: {
        type: String,
        required: true,
        trim: true
    },

    // Which module this group is for e.g. "CS204"
    module: {
        type: String,
        required: true,
        trim: true
    },

    // Optional description of the group
    description: {
        type: String,
        trim: true
    },

    // The user who created the group
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // List of members who have joined
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Optional next session date/time
    nextSession: {
        type: Date
    }

}, { timestamps: true });

module.exports = mongoose.model('StudyGroup', studyGroupSchema);