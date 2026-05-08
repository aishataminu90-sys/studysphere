const express = require('express');
const router = express.Router();
const StudyGroup = require('../models/StudyGroup');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all group routes
router.use(authMiddleware);


// CREATE - POST /groups
router.post('/', async (req, res) => {
    try {
        const { name, module, description, nextSession } = req.body;
        if (!name || !module) return res.status(400).json({ error: 'Group name and module are required' });

        const group = new StudyGroup({
            name, module, description, nextSession,
            createdBy: req.session.userId,
            members: [req.session.userId], // creator joins automatically
            pendingMembers: []
        });

        await group.save();
        res.status(201).json({ message: 'Study group created successfully', group });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// READ ALL - GET /groups
router.get('/', async (req, res) => {
    try {
        const groups = await StudyGroup.find()
            .populate('createdBy', 'name')
            .populate('members', 'name')
            .populate('pendingMembers', 'name') // populate so leader sees names
            .sort({ createdAt: -1 });

        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// READ ONE - GET /groups/:id
router.get('/:id', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id)
            .populate('createdBy', 'name')
            .populate('members', 'name')
            .populate('pendingMembers', 'name');

        if (!group) return res.status(404).json({ error: 'Study group not found' });
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// UPDATE - PUT /groups/:id (leader only)
router.put('/:id', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Study group not found' });
        if (group.createdBy.toString() !== req.session.userId) return res.status(403).json({ error: 'Only the group creator can edit this group' });

        const { name, module, description, nextSession } = req.body;
        if (!name || !module) return res.status(400).json({ error: 'Group name and module are required' });

        group.name = name;
        group.module = module;
        group.description = description;
        group.nextSession = nextSession;

        await group.save();
        res.status(200).json({ message: 'Study group updated successfully', group });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// DELETE - DELETE /groups/:id (leader only)
router.delete('/:id', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Study group not found' });
        if (group.createdBy.toString() !== req.session.userId) return res.status(403).json({ error: 'Only the group creator can delete this group' });

        await group.deleteOne();
        res.status(200).json({ message: 'Study group deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// REQUEST TO JOIN - POST /groups/:id/request
// Adds user to pendingMembers (the waiting room)
router.post('/:id/request', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Study group not found' });

        const userId = req.session.userId;

        // Block if already a member
        if (group.members.some(id => id.toString() === userId)) {
            return res.status(400).json({ error: 'You are already a member of this group' });
        }

        // Block if already pending
        if (group.pendingMembers.some(id => id.toString() === userId)) {
            return res.status(400).json({ error: 'You already have a pending request for this group' });
        }

        group.pendingMembers.push(userId);
        await group.save();

        res.status(200).json({ message: 'Join request sent. Waiting for leader approval.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// CANCEL REQUEST - DELETE /groups/:id/request
// User withdraws their own pending join request
router.delete('/:id/request', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Study group not found' });

        group.pendingMembers = group.pendingMembers.filter(
            id => id.toString() !== req.session.userId
        );

        await group.save();
        res.status(200).json({ message: 'Join request cancelled' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// APPROVE - POST /groups/:id/approve/:userId (leader only)
// Moves a user from pendingMembers to members
router.post('/:id/approve/:userId', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Study group not found' });
        if (group.createdBy.toString() !== req.session.userId) return res.status(403).json({ error: 'Only the group leader can approve requests' });

        const targetUserId = req.params.userId;

        if (!group.pendingMembers.some(id => id.toString() === targetUserId)) {
            return res.status(400).json({ error: 'This user does not have a pending request' });
        }

        // Remove from pending, add to members
        group.pendingMembers = group.pendingMembers.filter(id => id.toString() !== targetUserId);
        group.members.push(targetUserId);

        await group.save();
        res.status(200).json({ message: 'Member approved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// DENY - DELETE /groups/:id/deny/:userId (leader only)
// Removes a user from pendingMembers without adding them
router.delete('/:id/deny/:userId', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Study group not found' });
        if (group.createdBy.toString() !== req.session.userId) return res.status(403).json({ error: 'Only the group leader can deny requests' });

        group.pendingMembers = group.pendingMembers.filter(
            id => id.toString() !== req.params.userId
        );

        await group.save();
        res.status(200).json({ message: 'Request denied' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// LEAVE - POST /groups/:id/leave
// Member leaves a group — leader cannot leave, must delete instead
router.post('/:id/leave', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Study group not found' });

        const userId = req.session.userId;

        if (group.createdBy.toString() === userId) {
            return res.status(400).json({ error: 'As the group leader you cannot leave. Delete the group instead.' });
        }

        group.members = group.members.filter(id => id.toString() !== userId);
        await group.save();

        res.status(200).json({ message: 'You have left the group' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;