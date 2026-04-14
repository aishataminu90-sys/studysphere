const express = require('express');
const router = express.Router();
const StudyGroup = require('../models/StudyGroup');
const authMiddleware = require('../middleware/authMiddleware');

// Used to protect all group routes — must be logged in
router.use(authMiddleware);



// CREATE - POST /groups
// Create a new study group

router.post('/', async (req, res) => {
    try {
        const { name, module, description, nextSession } = req.body;

        // Validate required fields
        if (!name || !module) {
            return res.status(400).json({ error: 'Group name and module are required' });
        }

        // Create group and automatically adds creator as first member
        const group = new StudyGroup({
            name,
            module,
            description,
            nextSession,
            createdBy: req.session.userId,
            members: [req.session.userId] // creator joins automatically
        });

        await group.save();

        res.status(201).json({ message: 'Study group created successfully', group });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// READ ALL - GET /groups
// Get all study groups (everyone can browse)

router.get('/', async (req, res) => {
    try {
        const groups = await StudyGroup.find()
            .populate('createdBy', 'name')   // show creators name
            .populate('members', 'name')      // show member names
            .sort({ createdAt: -1 });

        res.status(200).json(groups);

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});



// READ ONE - GET /groups/:id
// Get a single study group by ID

router.get('/:id', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id)
            .populate('createdBy', 'name')
            .populate('members', 'name');

        if (!group) {
            return res.status(404).json({ error: 'Study group not found' });
        }

        res.status(200).json(group);

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});



// UPDATE - PUT /groups/:id
// Update a group (only the creator can do this)

router.put('/:id', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ error: 'Study group not found' });
        }

        // Only the creator can edit
        if (group.createdBy.toString() !== req.session.userId) {
            return res.status(403).json({ error: 'Only the group creator can edit this group' });
        }

        const { name, module, description, nextSession } = req.body;

        // Validate required fields
        if (!name || !module) {
            return res.status(400).json({ error: 'Group name and module are required' });
        }

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



// DELETE - DELETE /groups/:id
// Delete a group (only the creator can do this)

router.delete('/:id', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ error: 'Study group not found' });
        }

        // Only the creator can delete
        if (group.createdBy.toString() !== req.session.userId) {
            return res.status(403).json({ error: 'Only the group creator can delete this group' });
        }

        await group.deleteOne();

        res.status(200).json({ message: 'Study group deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});



// JOIN/LEAVE - POST /groups/:id/join
// Toggle joining or leaving a group

router.post('/:id/join', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ error: 'Study group not found' });
        }

        const userId = req.session.userId;
        const isMember = group.members.some(id => id.toString() === userId);

        if (isMember) {
            // Already a member — leave the group
            group.members = group.members.filter(id => id.toString() !== userId);
            await group.save();
            return res.status(200).json({ message: 'You have left the group' });
        } else {
            // Not a member — join the group
            group.members.push(userId);
            await group.save();
            return res.status(200).json({ message: 'You have joined the group' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;