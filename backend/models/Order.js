const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  variant: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  shopOwner: { type: String, default: '' },
  itemTotal: { type: Number, default: 0 }
});

const trackingSchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  totalItems: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  deliveryType: { type: String, enum: ['normal', 'fast'], default: 'normal' },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  tracking: [trackingSchema],
  location: { type: String, default: 'GEC Arwal' },
  deliveryAddress: { type: String, default: '' },
  phone: { type: String, required: true },
  notes: { type: String, default: '' },
  paymentMethod: { type: String, enum: ['cod', 'upi'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paidAt: { type: Date, default: null }
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'RPT' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);