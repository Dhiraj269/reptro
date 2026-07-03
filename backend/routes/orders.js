const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const calculateDeliveryCharge = (totalItems, deliveryType) => {
  if (deliveryType === 'fast') return 20;
  return Math.ceil(totalItems / 4) * 9;
};

router.post('/', protect, async (req, res) => {
  try {
    const { items, deliveryType, location, deliveryAddress, phone, notes, paymentMethod } = req.body;
    
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in cart' });
    if (!phone) return res.status(400).json({ message: 'Phone number required' });

    let totalItems = 0, subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      totalItems += item.quantity;
      subtotal += item.price * item.quantity;

      // Fetch product details for image and full info
      let productImage = '';
      let productName = item.name;
      let shopOwner = '';
      
      try {
        const product = await Product.findById(item.product);
        if (product) {
          productImage = product.image || '';
          productName = product.name;
          shopOwner = product.shopOwner || '';
          await Product.findByIdAndUpdate(item.product, { $inc: { orderCount: item.quantity } });
        }
      } catch (err) {
        console.log('Product lookup skipped for:', item.product);
      }

      processedItems.push({
        product: item.product,
        name: productName,
        image: productImage,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        shopOwner: shopOwner,
        itemTotal: item.price * item.quantity
      });
    }

    const deliveryCharge = calculateDeliveryCharge(totalItems, deliveryType);
    const total = subtotal + deliveryCharge;

    const orderData = {
      user: req.user._id,
      items: processedItems,
      totalItems,
      subtotal,
      deliveryCharge,
      deliveryType: deliveryType || 'normal',
      total,
      location: location || 'GEC Arwal',
      deliveryAddress: deliveryAddress || location || 'GEC Arwal',
      phone,
      notes: notes || '',
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'pending',
      tracking: [{
        status: 'pending',
        message: paymentMethod === 'upi'
          ? 'Order placed — Pay via UPI at delivery'
          : 'Order placed — Cash on Delivery',
        timestamp: new Date()
      }]
    };

    const order = new Order(orderData);
    const created = await order.save();
    
    console.log('✅ Order created:', created.orderNumber);
    res.status(201).json(created);
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ message: error.message || 'Order creation failed' });
  }
});

router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image shopOwner')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/track/:orderNumber', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.product', 'name image shopOwner')
      .populate('user', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/all', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone profilePic')
      .populate('items.product', 'name image shopOwner')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Get single order with full details (admin)
router.get('/details/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone profilePic selectedLocation')
      .populate('items.product', 'name image shopOwner');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    const messages = {
      'confirmed': 'Order confirmed by seller',
      'preparing': 'Your order is being prepared',
      'out_for_delivery': 'Order is out for delivery',
      'delivered': 'Order delivered successfully',
      'cancelled': 'Order has been cancelled'
    };
    order.tracking.push({
      status: req.body.status,
      message: req.body.message || messages[req.body.status] || 'Status updated',
      timestamp: new Date()
    });
    if (req.body.status === 'delivered') {
      order.paymentStatus = 'paid';
      order.paidAt = new Date();
    }
    const updated = await order.save();
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;