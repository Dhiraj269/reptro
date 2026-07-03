const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', async (req, res) => {
  try {
    const locations = await Location.find().sort({ order: 1 });
    res.json(locations);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, isActive, order } = req.body;
    const exists = await Location.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Location already exists' });
    const maxOrder = await Location.findOne().sort({ order: -1 });
    const location = new Location({
      name,
      isActive: isActive || false,
      order: order || (maxOrder ? maxOrder.order + 1 : 1)
    });
    const created = await location.save();
    res.status(201).json(created);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json(location);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    if (location.isDefault) return res.status(400).json({ message: 'Cannot delete default location' });
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Location deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;