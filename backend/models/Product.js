const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  stock: { type: Number, default: 0 },
  locationPrices: [{
    location: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null }
  }]
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String, default: '' },
  variants: [variantSchema],
  shopOwner: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  flashSaleEnd: { type: Date, default: null },
  flashSaleDiscount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  tags: [String]
}, { timestamps: true });

productSchema.index({ name: 'text', tags: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);