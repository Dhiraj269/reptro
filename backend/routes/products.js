const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sprout, fruit, flashsale, location } = req.query;
    let query = { isAvailable: true };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (sprout === 'true') query.isSprout = true;
    if (fruit === 'true') query.isFruit = true;
    if (flashsale === 'true') query.isFlashSale = true;
    if (search) {
      const searchRegex = new RegExp(search.split('').join('.*'), 'i');
      query.$or = [{ name: searchRegex }, { tags: searchRegex }, { description: searchRegex }];
    }
    let products = await Product.find(query).populate('category', 'name slug icon subtitle').sort({ orderCount: -1, createdAt: -1 });

    if (location) {
      products = products.map(p => {
        const prod = p.toObject();
        prod.variants = prod.variants.map(v => {
          const locPrice = v.locationPrices?.find(lp => lp.location === location);
          if (locPrice) {
            v.price = locPrice.price;
            v.originalPrice = locPrice.originalPrice || v.originalPrice;
          }
          return v;
        });
        return prod;
      });
    }

    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/popular', async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true }).populate('category', 'name slug').sort({ orderCount: -1 }).limit(10);
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/fresh', async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true, $or: [{ isSprout: true }, { isFruit: true }] }).populate('category', 'name slug');
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/flashsale', async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true, isFlashSale: true }).populate('category', 'name slug');
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 1) return res.json([]);
    const searchRegex = new RegExp(q, 'i');
    const products = await Product.find({ isAvailable: true, $or: [{ name: searchRegex }, { tags: searchRegex }] }).select('name category image variants').populate('category', 'name').limit(8);
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug icon');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const created = await product.save();
    res.status(201).json(created);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;