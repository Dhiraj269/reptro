const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dateString: { type: String, default: '' }, // Made optional
  dayName: { type: String, default: '' },
  dayNumber: { type: Number, default: 0 }, // Made optional with default
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
  startDateString: { type: String, default: '' },
  endDate: { type: Date, required: true },
  endDateString: { type: String, default: '' },
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

// Helper functions
function getISTDateString(date) {
  const d = new Date(date);
  const istDate = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
  return istDate.toISOString().split('T')[0];
}

function getISTDayName(date) {
  const d = new Date(date);
  const istDate = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[istDate.getUTCDay()];
}

subscriptionSchema.pre('save', function(next) {
  // Only for new documents - create attendance array
  if (this.isNew && this.attendance.length === 0) {
    const startDateInput = new Date(this.startDate);
    const year = startDateInput.getFullYear();
    const month = startDateInput.getMonth();
    const day = startDateInput.getDate();
    
    const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
    
    const attendanceArray = [];
    for (let i = 0; i < this.totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setUTCDate(startDate.getUTCDate() + i);
      
      attendanceArray.push({
        date: currentDate,
        dateString: getISTDateString(currentDate),
        dayName: getISTDayName(currentDate),
        dayNumber: i + 1,
        status: 'pending',
        markedAt: null,
        markedBy: '',
        notes: ''
      });
    }
    
    this.attendance = attendanceArray;
    this.startDate = startDate;
    this.startDateString = getISTDateString(startDate);
    
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + this.totalDays - 1);
    this.endDate = endDate;
    this.endDateString = getISTDateString(endDate);
    
    this.totalSavings = (this.singleBowlPrice * this.totalDays) - this.monthlyPrice;
  }
  
  // For existing documents - migrate missing fields
  if (!this.isNew && this.attendance && this.attendance.length > 0) {
    this.attendance.forEach((att, index) => {
      // Add missing fields to old attendance records
      if (!att.dateString) {
        att.dateString = getISTDateString(att.date);
      }
      if (!att.dayName) {
        att.dayName = getISTDayName(att.date);
      }
      if (!att.dayNumber) {
        att.dayNumber = index + 1;
      }
    });
    
    // Add missing top-level fields
    if (!this.startDateString) {
      this.startDateString = getISTDateString(this.startDate);
    }
    if (!this.endDateString) {
      this.endDateString = getISTDateString(this.endDate);
    }
  }
  
  // Auto-expire check
  const todayIST = getISTDateString(new Date());
  if (this.endDateString && todayIST > this.endDateString && this.status === 'active') {
    this.status = 'expired';
  }
  
  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);