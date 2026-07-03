const mongoose = require('mongoose');

const reptroFreshSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['sprout', 'fruit'], required: true },
  description: { type: String, default: 'Rich in nutrients, perfect for daily health' },
  shopOwner: { type: String, default: 'Reptro Fresh' },
  image: { type: String, default: '' },
  
  // Single bowl pricing
  singleBowlPrice: { type: Number, required: true },
  singleBowlOriginalPrice: { type: Number, default: null },
  bowlSize: { type: String, default: 'Single Bowl' },
  
  // Monthly subscription pricing
  monthlyPrice: { type: Number, required: true },
  monthlyOriginalPrice: { type: Number, default: null },
  monthlyDays: { type: Number, default: 30 },
  
  // Health benefits
  healthBenefits: { type: String, default: 'Boost immunity, rich in protein & vitamins' },
  
  // Status
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  stock: { type: Number, default: 100 },
  orderCount: { type: Number, default: 0 }
}, { timestamps: true });

// Calculate savings automatically
reptroFreshSchema.virtual('monthlySavings').get(function() {
  const dailyTotal = this.singleBowlPrice * this.monthlyDays;
  return dailyTotal - this.monthlyPrice;
});

reptroFreshSchema.virtual('savingsPercent').get(function() {
  const dailyTotal = this.singleBowlPrice * this.monthlyDays;
  if (dailyTotal === 0) return 0;
  return Math.round(((dailyTotal - this.monthlyPrice) / dailyTotal) * 100);
});

reptroFreshSchema.set('toJSON', { virtuals: true });
reptroFreshSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ReptroFresh', reptroFreshSchema);