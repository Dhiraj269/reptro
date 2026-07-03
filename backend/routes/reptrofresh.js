const express = require('express');
const router = express.Router();
const ReptroFresh = require('../models/ReptroFresh');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Get all (public)
router.get('/', async (req, res) => {
  try {
    const items = await ReptroFresh.find({ isAvailable: true }).sort({ orderCount: -1 });
    res.json(items);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Get all (admin)
router.get('/all', protect, admin, async (req, res) => {
  try {
    const items = await ReptroFresh.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Create
router.post('/', protect, admin, async (req, res) => {
  try {
    const item = new ReptroFresh(req.body);
    const created = await item.save();
    res.status(201).json(created);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Update
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const item = await ReptroFresh.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Delete
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await ReptroFresh.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;