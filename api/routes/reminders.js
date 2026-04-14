const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const authMiddleware = require('../middleware/authMiddleware');

//  To protect all reminder routes — must be logged in
router.use(authMiddleware);


// CREATE - POST /reminders
// Add a new reminder
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        // Validate required fields
        if (!title || !dueDate) {
            return res.status(400).json({ error: 'Title and due date are required' });
        }

        // Make sure the date is valid
        const parsedDate = new Date(dueDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const reminder = new Reminder({
            title,
            description,
            dueDate: parsedDate,
            user: req.session.userId  // link reminder to logged-in user
        });

        await reminder.save();

        res.status(201).json({ message: 'Reminder created successfully', reminder });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// READ ALL - GET /reminders
// Get all reminders for the logged-in user only
router.get('/', async (req, res) => {
    try {
        // Only fetch reminders belonging to this user
        const reminders = await Reminder.find({ user: req.session.userId })
            .sort({ dueDate: 1 }); // soonest due date first

        res.status(200).json(reminders);

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// UPDATE - PUT /reminders/:id
// Edit a reminder (only owner can do this)
router.put('/:id', async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        // Make sure this reminder belongs to the logged-in user
        if (reminder.user.toString() !== req.session.userId) {
            return res.status(403).json({ error: 'You can only edit your own reminders' });
        }

        const { title, description, dueDate, completed } = req.body;

        // Validate required fields
        if (!title || !dueDate) {
            return res.status(400).json({ error: 'Title and due date are required' });
        }

        const parsedDate = new Date(dueDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        reminder.title = title;
        reminder.description = description;
        reminder.dueDate = parsedDate;
        reminder.completed = completed;

        await reminder.save();

        res.status(200).json({ message: 'Reminder updated successfully', reminder });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// MARK COMPLETE - PATCH /reminders/:id/complete
// Toggle a reminder as done or not done
router.patch('/:id/complete', async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        // Only the owner can mark it complete
        if (reminder.user.toString() !== req.session.userId) {
            return res.status(403).json({ error: 'You can only update your own reminders' });
        }

        // Toggle completed status
        reminder.completed = !reminder.completed;
        await reminder.save();

        const status = reminder.completed ? 'completed' : 'marked incomplete';
        res.status(200).json({ message: `Reminder ${status}`, reminder });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// DELETE - DELETE /reminders/:id
// Delete a reminder (only owner can do this)
router.delete('/:id', async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        // Only the owner can delete it
        if (reminder.user.toString() !== req.session.userId) {
            return res.status(403).json({ error: 'You can only delete your own reminders' });
        }

        await reminder.deleteOne();

        res.status(200).json({ message: 'Reminder deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;