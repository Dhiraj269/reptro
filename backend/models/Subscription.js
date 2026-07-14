const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'delivered', 'skipped', 'holiday', 'missed'], 
    default: 'pending' 
  },
  markedAt: { type: Date, default: null },
  markedBy: { type: String, default: '' },
  notes: { type: String, default: '' }
});

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freshItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ReptroFresh', required: true },
  itemName: { type: String, required: true },
  itemType: { type: String, enum: ['sprout', 'fruit'], required: true },
  bowlSize: { type: String, default: 'Single Bowl' },
  monthlyPrice: { type: Number, required: true },
  singleBowlPrice: { type: Number, required: true },
  totalSavings: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, default: 28 },
  status: { type: String, enum: ['active', 'expired', 'cancelled', 'paused'], default: 'active' },
  attendance: [attendanceSchema],
  deliveredCount: { type: Number, default: 0 },
  skippedCount: { type: Number, default: 0 },
  pendingCount: { type: Number, default: 28 },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cod', 'upi'], default: 'cod' },
  deliveryAddress: { type: String, default: 'GEC Arwal' },
  phone: { type: String, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Only run pre-save for NEW subscriptions
subscriptionSchema.pre('save', function(next) {
  // Only for new documents - create attendance array
  if (this.isNew && this.attendance.length === 0) {
    const startDate = new Date(this.startDate);
    const attendanceArray = [];
    for (let i = 0; i < this.totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      currentDate.setHours(0, 0, 0, 0);
      attendanceArray.push({
        date: currentDate,
        status: 'pending',
        markedAt: null,
        markedBy: '',
        notes: ''
      });
    }
    this.attendance = attendanceArray;
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + this.totalDays - 1);
    this.endDate = endDate;
    this.totalSavings = (this.singleBowlPrice * this.totalDays) - this.monthlyPrice;
  }
  
  // Auto-expire check
  if (new Date() > new Date(this.endDate) && this.status === 'active') {
    this.status = 'expired';
  }
  
  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);