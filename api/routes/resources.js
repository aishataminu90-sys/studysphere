const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// GET all resources (with optional search by title, module or tags)
router.get('/', async (req, res) => {
  try {
    const { title, module, tags } = req.query;
    let query = {};

    // Build search query from query params
    if (title) query.title = { $regex: title, $options: 'i' };
    if (module) query.module = { $regex: module, $options: 'i' };
    if (tags) query.tags = { $in: tags.split(',') };

    const resources = await Resource.find(query);
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - get all saved/bookmarked resources for logged in user
router.get('/saved', async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: 'You must be logged in to view saved resources.' });

    const saved = await Resource.find({ savedBy: userId });
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.status(200).json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - upload a new resource
router.post('/', async (req, res) => {
  try {
    const { title, module, tags, description, link } = req.body;

    // Server-side validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required.' });
    }
    if (!module || module.trim() === '') {
      return res.status(400).json({ error: 'Module is required.' });
    }

    const resource = new Resource({
      title,
      module,
      tags,
      description,
      link,
      uploadedBy: req.session?.userId || null
    });

    const saved = await resource.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - edit a resource by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, module, tags, description, link } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required.' });
    }
    if (!module || module.trim() === '') {
      return res.status(400).json({ error: 'Module is required.' });
    }

    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      { title, module, tags, description, link },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Resource not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - delete a resource by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Resource.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Resource not found' });
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - save/bookmark a resource
router.post('/:id/save', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: 'You must be logged in to save resources.' });

    // Add user to savedBy if not already saved
    if (!resource.savedBy.includes(userId)) {
      resource.savedBy.push(userId);
      await resource.save();
    }

    res.status(200).json({ message: 'Resource saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;