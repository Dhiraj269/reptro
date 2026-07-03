const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Get all active categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json(categories);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Get all categories including inactive (admin)
router.get('/all', protect, admin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Create category (admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, icon, subtitle, isActive } = req.body;

    if (!name) return res.status(400).json({ message: 'Category name required' });

    // Auto-generate slug from name
    const slug = name.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Check if slug already exists
    const exists = await Category.findOne({ slug });
    if (exists) return res.status(400).json({ message: 'Category with similar name already exists' });

    // Get max order
    const maxOrder = await Category.findOne().sort({ order: -1 });

    const category = new Category({
      name,
      slug,
      icon: icon || '📦',
      subtitle: subtitle || 'Fresh & delivered fast',
      isActive: isActive !== undefined ? isActive : true,
      order: maxOrder ? maxOrder.order + 1 : 1
    });

    const created = await category.save();
    res.status(201).json(created);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Update category (admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If name is being updated, regenerate slug
    if (req.body.name) {
      updateData.slug = req.body.name.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Check if new slug conflicts with another category
      const existing = await Category.findOne({ slug: updateData.slug, _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ message: 'Category with this name exists' });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Delete category (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Check if products exist in this category
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete! ' + productCount + ' products exist in this category. Move or delete products first.'
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Toggle category active status (admin)
router.put('/:id/toggle', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    category.isActive = !category.isActive;
    await category.save();
    res.json(category);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;