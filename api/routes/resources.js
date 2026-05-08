const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// checks if text contains unsafe or injected content
const containsUnsafeContent = (text = '') => {
  const unsafePatterns = [
    /<script.*?>.*?<\/script>/gi,
    /<[^>]+>/g,
    /javascript:/gi,
    /onerror=/gi,
    /onload=/gi
  ];
  return unsafePatterns.some((pattern) => pattern.test(text));
};

// get all resources with optional filters
router.get('/', async (req, res) => {
  try {
    const { title, module, tags } = req.query;
    let query = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (module) query.module = { $regex: module, $options: 'i' };
    if (tags) query.tags = { $in: tags.split(',') };

    const resources = await Resource.find(query).populate('uploadedBy', 'name');
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get saved resources for logged in user
router.get('/saved', async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: 'you must be logged in to view saved resources.' });

    const saved = await Resource.find({ savedBy: userId }).populate('uploadedBy', 'name');
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get a single resource by id
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name');
    if (!resource) return res.status(404).json({ error: 'resource not found' });
    res.status(200).json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create a new resource
router.post('/', async (req, res) => {
  try {
    const { title, module, tags, description, link } = req.body;

    if (!title || title.trim() === '')
      return res.status(400).json({ error: 'title is required.' });
    if (containsUnsafeContent(title))
      return res.status(400).json({ error: 'title contains invalid content.' });
    if (!module || module.trim() === '')
      return res.status(400).json({ error: 'module is required.' });
    if (containsUnsafeContent(module))
      return res.status(400).json({ error: 'module contains invalid content.' });
    if (!description || description.trim() === '')
      return res.status(400).json({ error: 'description is required.' });
    if (containsUnsafeContent(description))
      return res.status(400).json({ error: 'description contains invalid content.' });
    if (!link || link.trim() === '')
      return res.status(400).json({ error: 'a file link is required.' });

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

// update a resource by id
router.put('/:id', async (req, res) => {
  try {
    const { title, module, tags, description, link } = req.body;

    if (!title || title.trim() === '')
      return res.status(400).json({ error: 'title is required.' });
    if (containsUnsafeContent(title))
      return res.status(400).json({ error: 'title contains invalid content.' });
    if (!module || module.trim() === '')
      return res.status(400).json({ error: 'module is required.' });
    if (containsUnsafeContent(module))
      return res.status(400).json({ error: 'module contains invalid content.' });
    if (!description || description.trim() === '')
      return res.status(400).json({ error: 'description is required.' });
    if (containsUnsafeContent(description))
      return res.status(400).json({ error: 'description contains invalid content.' });
    if (!link || link.trim() === '')
      return res.status(400).json({ error: 'a file link is required.' });

    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      { title, module, tags, description, link },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'resource not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete a resource by id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Resource.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'resource not found' });
    res.status(200).json({ message: 'resource deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// toggle save or unsave a resource
router.post('/:id/save', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'resource not found' });

    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: 'you must be logged in to save resources.' });

    const alreadySaved = resource.savedBy.map(id => id.toString()).includes(userId.toString());

    if (alreadySaved) {
      resource.savedBy = resource.savedBy.filter(id => id.toString() !== userId.toString());
      await resource.save();
      return res.status(200).json({ saved: false, message: 'resource unsaved' });
    } else {
      resource.savedBy.push(userId);
      await resource.save();
      return res.status(200).json({ saved: true, message: 'resource saved' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - rate a resource (1 to 5 stars)
// each user can only have one rating per resource - submitting again updates it
router.post('/:id/rate', async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: 'you must be logged in to rate resources.' });

    const { value } = req.body;
    if (!value || value < 1 || value > 5)
      return res.status(400).json({ error: 'rating must be between 1 and 5.' });

    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'resource not found' });

    // check if user already rated - if so update it
    const existingIndex = resource.ratings.findIndex(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingIndex !== -1) {
      resource.ratings[existingIndex].value = value;
    } else {
      resource.ratings.push({ user: userId, value });
    }

    await resource.save();

    // calculate average rating to send back
    const avg = resource.ratings.reduce((sum, r) => sum + r.value, 0) / resource.ratings.length;

    res.status(200).json({
      message: 'rating saved',
      averageRating: Math.round(avg * 10) / 10,
      totalRatings: resource.ratings.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;