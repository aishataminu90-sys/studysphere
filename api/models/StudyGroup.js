const mongoose = require('mongoose');

// Schema for a study group — includes pendingMembers for the waiting room feature
const studyGroupSchema = new mongoose.Schema({

    name: { type: String, required: true, trim: true },
    module: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // The user who created the group — acts as the group leader
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Fully approved members
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Users who have requested to join but are waiting for leader approval
    pendingMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    nextSession: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('StudyGroup', studyGroupSchema);