const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const ReptroFresh = require('../models/ReptroFresh');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Helper function for IST date
function getISTDateString(date) {
  const d = new Date(date);
  const istDate = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
  return istDate.toISOString().split('T')[0];
}

// USER ROUTES
router.get('/my-subscriptions', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate('freshItem', 'name type image healthBenefits')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/my-subscription/:id', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id, user: req.user._id
    }).populate('freshItem', 'name type image healthBenefits bowlSize');
    if (!subscription) return res.status(404).json({ message: 'Not found' });
    res.json(subscription);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// ADMIN ROUTES
router.get('/all', protect, admin, async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('user', 'name email phone profilePic')
      .populate('freshItem', 'name type image bowlSize')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/details/:id', protect, admin, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate('user', 'name email phone profilePic')
      .populate('freshItem', 'name type image bowlSize');
    if (!subscription) return res.status(404).json({ message: 'Not found' });
    res.json(subscription);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/create', protect, admin, async (req, res) => {
  try {
    const { userId, freshItemId, startDate, paymentMethod, notes } = req.body;
    if (!userId || !freshItemId) return res.status(400).json({ message: 'User and Fresh item required' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const freshItem = await ReptroFresh.findById(freshItemId);
    if (!freshItem) return res.status(404).json({ message: 'Fresh item not found' });
    
    const existingActive = await Subscription.findOne({
      user: userId, freshItem: freshItemId, status: 'active'
    });
    if (existingActive) return res.status(400).json({ message: 'Active subscription exists' });
    
    // Parse date in IST properly
    let startDateObj;
    if (startDate) {
      // Input format: YYYY-MM-DD
      const [year, month, day] = startDate.split('-').map(Number);
      // Create UTC date at start of day IST
      startDateObj = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    } else {
      // Use today in IST
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istNow = new Date(now.getTime() + istOffset);
      startDateObj = new Date(Date.UTC(
        istNow.getUTCFullYear(),
        istNow.getUTCMonth(),
        istNow.getUTCDate(),
        0, 0, 0
      ));
    }
    
    const subscription = new Subscription({
      user: userId,
      freshItem: freshItemId,
      itemName: freshItem.name,
      itemType: freshItem.type,
      bowlSize: freshItem.bowlSize,
      monthlyPrice: freshItem.monthlyPrice,
      singleBowlPrice: freshItem.singleBowlPrice,
      startDate: startDateObj,
      endDate: new Date(startDateObj.getTime() + 27 * 24 * 60 * 60 * 1000),
      totalDays: 28,
      status: 'active',
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'paid',
      deliveryAddress: user.deliveryAddress || user.selectedLocation || 'GEC Arwal',
      phone: user.phone,
      notes: notes || ''
    });
    
    const created = await subscription.save();
    res.status(201).json({ success: true, message: 'Activated!', subscription: created });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Not found' });
    subscription.status = req.body.status;
    await subscription.save();
    res.json({ success: true, subscription });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/attendance/:dateIndex', protect, admin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { id, dateIndex } = req.params;
    
    const validStatuses = ['pending', 'delivered', 'skipped', 'holiday', 'missed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    const index = parseInt(dateIndex);
    if (isNaN(index) || index < 0 || index >= subscription.attendance.length) {
      return res.status(400).json({ message: 'Invalid date index' });
    }
    
    subscription.attendance[index].status = status;
    subscription.attendance[index].markedAt = new Date();
    subscription.attendance[index].markedBy = req.user.name || 'Admin';
    subscription.attendance[index].notes = notes || '';
    
    subscription.markModified('attendance');
    
    subscription.deliveredCount = subscription.attendance.filter(a => a.status === 'delivered').length;
    subscription.skippedCount = subscription.attendance.filter(a => a.status === 'skipped').length;
    subscription.pendingCount = subscription.attendance.filter(a => a.status === 'pending').length;
    
    await subscription.save();
    
    res.json({ 
      success: true, 
      message: `Day ${index + 1} marked as ${status}`,
      subscription 
    });
  } catch (error) {
    console.error('Attendance update error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/bulk-attendance', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const todayIST = getISTDateString(new Date());
    
    const activeSubs = await Subscription.find({ status: 'active' });
    let updated = 0;
    
    for (const sub of activeSubs) {
      const todayIndex = sub.attendance.findIndex(a => a.dateString === todayIST);
      
      if (todayIndex !== -1 && sub.attendance[todayIndex].status === 'pending') {
        sub.attendance[todayIndex].status = status || 'delivered';
        sub.attendance[todayIndex].markedAt = new Date();
        sub.attendance[todayIndex].markedBy = req.user.name || 'Admin';
        
        sub.markModified('attendance');
        sub.deliveredCount = sub.attendance.filter(a => a.status === 'delivered').length;
        sub.skippedCount = sub.attendance.filter(a => a.status === 'skipped').length;
        sub.pendingCount = sub.attendance.filter(a => a.status === 'pending').length;
        
        await sub.save();
        updated++;
      }
    }
    
    res.json({ success: true, count: updated });
  } catch (error) { 
    console.error('Bulk error:', error);
    res.status(500).json({ message: error.message }); 
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;