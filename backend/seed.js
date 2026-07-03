const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Category = require('./models/Category');
const Location = require('./models/Location');
const Product = require('./models/Product');
const ReptroFresh = require('./models/ReptroFresh');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    await Category.deleteMany({});
    await Location.deleteMany({});
    await Product.deleteMany({});
    await ReptroFresh.deleteMany({});

    const admin = await User.create({
      name: 'Admin', email: 'admin@reptro.in', phone: '9279167527',
      password: 'Reptro@Admin2024', role: 'admin'
    });
    console.log('✅ Admin: admin@reptro.in / Reptro@Admin2024');

    await Location.insertMany([
      { name: 'GEC Arwal', isActive: true, isDefault: true, order: 1 },
      { name: 'Arwal Town', isActive: false, order: 2 },
      { name: 'Polytechnic Arwal', isActive: false, order: 3 },
      { name: 'ITI Arwal', isActive: false, order: 4 }
    ]);
    console.log('✅ Locations created');

    const categories = await Category.insertMany([
      { name: 'Bakery & Bread', slug: 'bakery-and-bread', icon: '🍞', subtitle: 'Fresh baked daily', order: 1 },
      { name: 'Beverages', slug: 'beverages', icon: '🥤', subtitle: 'Refresh yourself', order: 2 },
      { name: 'Dairy & Eggs', slug: 'dairy-and-eggs', icon: '🥛', subtitle: 'Farm fresh', order: 3 },
      { name: 'Fruits & Vegetables', slug: 'fruits-and-vegetables', icon: '🥬', subtitle: 'Fresh & organic', order: 4 },
      { name: 'Grocery Essentials', slug: 'grocery-essentials', icon: '🛒', subtitle: 'Daily essentials', order: 5 },
      { name: 'Medicine & Health', slug: 'medicine-and-health', icon: '💊', subtitle: 'Health first', order: 6 },
      { name: 'Personal Care', slug: 'personal-care', icon: '🧴', subtitle: 'Fresh & delivered', order: 7 },
      { name: 'Snacks & Fast Food', slug: 'snacks-and-fast-food', icon: '🍟', subtitle: 'Yummy snacks', order: 8 },
      { name: 'Stationery', slug: 'stationery', icon: '📝', subtitle: 'Study essentials', order: 9 }
    ]);
    console.log('✅ Categories created');

    const getCat = (slug) => categories.find(c => c.slug === slug);

    await Product.insertMany([
      // ============ BAKERY & BREAD ============
      { name: 'Britannia Bread', category: getCat('bakery-and-bread')._id, variants: [{ size: '400g', price: 35, originalPrice: 40, stock: 30 }, { size: '700g', price: 55, originalPrice: 60, stock: 20 }], shopOwner: 'Bakery Corner', tags: ['bread', 'britannia'], orderCount: 110 },
      { name: 'Parle-G Biscuit', category: getCat('bakery-and-bread')._id, variants: [{ size: '80g', price: 10, stock: 200 }, { size: '250g', price: 25, originalPrice: 28, stock: 100 }], shopOwner: 'Bakery Corner', tags: ['biscuit', 'parle'], orderCount: 180 },
      { name: 'Good Day Cookies', category: getCat('bakery-and-bread')._id, variants: [{ size: '90g', price: 20, stock: 150 }, { size: '250g', price: 50, originalPrice: 55, stock: 80 }], shopOwner: 'Bakery Corner', tags: ['cookies', 'goodday'], orderCount: 95 },
      { name: 'Marie Gold Biscuit', category: getCat('bakery-and-bread')._id, variants: [{ size: '150g', price: 20, stock: 120 }], shopOwner: 'Bakery Corner', tags: ['biscuit', 'marie'], orderCount: 78 },
      { name: 'Britannia Cake Slice', category: getCat('bakery-and-bread')._id, variants: [{ size: 'Single', price: 10, stock: 100 }, { size: 'Pack of 6', price: 55, originalPrice: 60, stock: 40 }], shopOwner: 'Bakery Corner', tags: ['cake', 'britannia'], orderCount: 65 },
      { name: 'Bourbon Biscuit', category: getCat('bakery-and-bread')._id, variants: [{ size: '150g', price: 30, stock: 100 }], shopOwner: 'Bakery Corner', tags: ['bourbon', 'chocolate'], orderCount: 55 },

      // ============ BEVERAGES ============
      { name: 'Coca-Cola', category: getCat('beverages')._id, variants: [{ size: '250ml', price: 20, stock: 200 }, { size: '750ml', price: 40, stock: 100 }, { size: '2L', price: 95, stock: 50 }], shopOwner: 'Beverage House', tags: ['coke', 'coca cola'], orderCount: 250 },
      { name: 'Thumbs Up', category: getCat('beverages')._id, variants: [{ size: '250ml', price: 20, stock: 150 }, { size: '750ml', price: 40, stock: 80 }], shopOwner: 'Beverage House', tags: ['thumbs up'], orderCount: 200 },
      { name: 'Sprite', category: getCat('beverages')._id, variants: [{ size: '250ml', price: 20, stock: 150 }, { size: '750ml', price: 40, stock: 70 }], shopOwner: 'Beverage House', tags: ['sprite', 'lemon'], orderCount: 180 },
      { name: 'Pepsi', category: getCat('beverages')._id, variants: [{ size: '250ml', price: 20, stock: 130 }, { size: '750ml', price: 40, stock: 70 }], shopOwner: 'Beverage House', tags: ['pepsi'], orderCount: 175 },
      { name: 'Fanta Orange', category: getCat('beverages')._id, variants: [{ size: '250ml', price: 20, stock: 100 }, { size: '750ml', price: 40, stock: 50 }], shopOwner: 'Beverage House', tags: ['fanta', 'orange'], orderCount: 120 },
      { name: 'Frooti Mango', category: getCat('beverages')._id, variants: [{ size: '200ml', price: 15, stock: 200 }, { size: '600ml', price: 40, stock: 80 }], shopOwner: 'Beverage House', tags: ['frooti', 'mango', 'juice'], orderCount: 145 },
      { name: 'Real Fruit Juice', category: getCat('beverages')._id, variants: [{ size: '200ml', price: 20, stock: 100 }, { size: '1L', price: 110, stock: 30 }], shopOwner: 'Beverage House', tags: ['real', 'juice'], orderCount: 90 },
      { name: 'Kinley Water', category: getCat('beverages')._id, variants: [{ size: '500ml', price: 10, stock: 300 }, { size: '1L', price: 20, stock: 200 }], shopOwner: 'Beverage House', tags: ['water', 'kinley'], orderCount: 280 },
      { name: 'Red Bull Energy', category: getCat('beverages')._id, variants: [{ size: '250ml', price: 125, stock: 50 }], shopOwner: 'Beverage House', tags: ['redbull', 'energy'], orderCount: 45 },
      { name: 'Bisleri Water', category: getCat('beverages')._id, variants: [{ size: '1L', price: 20, stock: 150 }, { size: '2L', price: 35, stock: 80 }], shopOwner: 'Beverage House', tags: ['water', 'bisleri'], orderCount: 220 },
      { name: 'Tang Orange Powder', category: getCat('beverages')._id, variants: [{ size: '500g', price: 165, originalPrice: 180, stock: 40 }], shopOwner: 'Beverage House', tags: ['tang', 'juice powder'], orderCount: 60 },

      // ============ DAIRY & EGGS ============
      { name: 'Amul Milk', category: getCat('dairy-and-eggs')._id, variants: [{ size: '500ml', price: 30, stock: 80 }, { size: '1L', price: 56, stock: 50 }], shopOwner: 'Dairy Point', tags: ['milk', 'amul'], orderCount: 300 },
      { name: 'Mother Dairy Milk', category: getCat('dairy-and-eggs')._id, variants: [{ size: '500ml', price: 30, stock: 70 }, { size: '1L', price: 55, stock: 40 }], shopOwner: 'Dairy Point', tags: ['milk', 'mother dairy'], orderCount: 220 },
      { name: 'Farm Fresh Eggs', category: getCat('dairy-and-eggs')._id, variants: [{ size: '6 pcs', price: 42, originalPrice: 48, stock: 60 }, { size: '12 pcs', price: 78, originalPrice: 90, stock: 40 }, { size: '30 pcs', price: 195, stock: 20 }], shopOwner: 'Dairy Point', tags: ['eggs'], orderCount: 250 },
      { name: 'Amul Butter', category: getCat('dairy-and-eggs')._id, variants: [{ size: '100g', price: 55, stock: 80 }, { size: '500g', price: 265, originalPrice: 280, stock: 30 }], shopOwner: 'Dairy Point', tags: ['butter', 'amul'], orderCount: 160 },
      { name: 'Amul Cheese Slice', category: getCat('dairy-and-eggs')._id, variants: [{ size: '10 slices', price: 130, originalPrice: 140, stock: 50 }], shopOwner: 'Dairy Point', tags: ['cheese', 'amul'], orderCount: 95 },
      { name: 'Curd (Dahi)', category: getCat('dairy-and-eggs')._id, variants: [{ size: '400g', price: 40, stock: 80 }, { size: '1kg', price: 90, stock: 40 }], shopOwner: 'Dairy Point', tags: ['curd', 'dahi'], orderCount: 190 },
      { name: 'Paneer', category: getCat('dairy-and-eggs')._id, variants: [{ size: '200g', price: 90, originalPrice: 100, stock: 40 }, { size: '500g', price: 220, originalPrice: 250, stock: 25 }], shopOwner: 'Dairy Point', tags: ['paneer', 'cheese'], orderCount: 130 },
      { name: 'Amul Lassi', category: getCat('dairy-and-eggs')._id, variants: [{ size: '250ml', price: 20, stock: 100 }, { size: '1L', price: 80, stock: 40 }], shopOwner: 'Dairy Point', tags: ['lassi', 'amul'], orderCount: 110 },
      { name: 'Ghee', category: getCat('dairy-and-eggs')._id, variants: [{ size: '200ml', price: 130, stock: 40 }, { size: '500ml', price: 315, originalPrice: 340, stock: 25 }, { size: '1L', price: 620, originalPrice: 650, stock: 15 }], shopOwner: 'Dairy Point', tags: ['ghee'], orderCount: 85 },

      // ============ FRUITS & VEGETABLES ============
      { name: 'Onion', category: getCat('fruits-and-vegetables')._id, variants: [{ size: '500g', price: 20, stock: 100 }, { size: '1kg', price: 38, stock: 80 }], shopOwner: 'Fresh Mart', tags: ['onion', 'vegetable'], orderCount: 320 },
      { name: 'Potato', category: getCat('fruits-and-vegetables')._id, variants: [{ size: '500g', price: 18, stock: 100 }, { size: '1kg', price: 32, stock: 80 }], shopOwner: 'Fresh Mart', tags: ['potato', 'vegetable'], orderCount: 310 },
      { name: 'Tomato', category: getCat('fruits-and-vegetables')._id, variants: [{ size: '500g', price: 25, stock: 80 }, { size: '1kg', price: 45, stock: 60 }], shopOwner: 'Fresh Mart', tags: ['tomato'], orderCount: 280 },
      { name: 'Green Chili', category: getCat('fruits-and-vegetables')._id, variants: [{ size: '100g', price: 8, stock: 100 }, { size: '250g', price: 18, stock: 60 }], shopOwner: 'Fresh Mart', tags: ['chili', 'mirchi'], orderCount: 200 },
      { name: 'Ginger', category: getCat('fruits-and-vegetables')._id, variants: [{ size: '100g', price: 12, stock: 80 }, { size: '250g', price: 28, stock: 50 }], shopOwner: 'Fresh Mart', tags: ['ginger', 'adrak'], orderCount: 180 },
      { name: 'Garlic', category: getCat('fruits-and-vegetables')._id, variants: [{ size: '100g', price: 25, stock: 80 }, { size: '250g', price: 58, stock: 50 }], shopOwner: 'Fresh Mart', tags: ['garlic', 'lehsun'], orderCount: 170 },
      { name: 'Lemon', category: getCat('fruits-and-vegetables')._id, variants: [{ size: '4 pcs', price: 15, stock: 100 }, { size: '10 pcs', price: 35, stock: 60 }], shopOwner: 'Fresh Mart', tags: ['lemon', 'nimbu'], orderCount: 150 },
      { name: 'Fresh Coriander', category: getCat('fruits-and-vegetables')._id, variants: [{ size: '100g', price: 10, stock: 80 }], shopOwner: 'Fresh Mart', tags: ['coriander', 'dhania'], orderCount: 130 },

      // ============ GROCERY ESSENTIALS ============
      { name: 'Maggi Noodles', category: getCat('grocery-essentials')._id, variants: [{ size: '70g', price: 14, stock: 500 }, { size: '140g (2 pack)', price: 28, stock: 300 }, { size: '560g (8 pack)', price: 108, originalPrice: 112, stock: 100 }], shopOwner: 'Grocery Store', tags: ['maggi', 'noodles'], orderCount: 450 },
      { name: 'Yippee Noodles', category: getCat('grocery-essentials')._id, variants: [{ size: '70g', price: 14, stock: 300 }, { size: '280g (4 pack)', price: 55, stock: 100 }], shopOwner: 'Grocery Store', tags: ['yippee', 'noodles'], orderCount: 220 },
      { name: 'Tata Salt', category: getCat('grocery-essentials')._id, variants: [{ size: '1kg', price: 28, stock: 200 }], shopOwner: 'Grocery Store', tags: ['salt', 'tata'], orderCount: 280 },
      { name: 'Sugar', category: getCat('grocery-essentials')._id, variants: [{ size: '500g', price: 24, stock: 150 }, { size: '1kg', price: 46, stock: 100 }, { size: '5kg', price: 225, originalPrice: 240, stock: 30 }], shopOwner: 'Grocery Store', tags: ['sugar', 'chini'], orderCount: 250 },
      { name: 'Basmati Rice', category: getCat('grocery-essentials')._id, variants: [{ size: '1kg', price: 90, stock: 80 }, { size: '5kg', price: 430, originalPrice: 460, stock: 30 }], shopOwner: 'Grocery Store', tags: ['rice', 'basmati'], orderCount: 190 },
      { name: 'Aashirvaad Atta', category: getCat('grocery-essentials')._id, variants: [{ size: '1kg', price: 55, stock: 100 }, { size: '5kg', price: 265, originalPrice: 285, stock: 40 }, { size: '10kg', price: 520, originalPrice: 560, stock: 20 }], shopOwner: 'Grocery Store', tags: ['atta', 'flour', 'aashirvaad'], orderCount: 200 },
      { name: 'Toor Dal', category: getCat('grocery-essentials')._id, variants: [{ size: '500g', price: 75, stock: 100 }, { size: '1kg', price: 145, originalPrice: 160, stock: 60 }], shopOwner: 'Grocery Store', tags: ['dal', 'toor'], orderCount: 170 },
      { name: 'Moong Dal', category: getCat('grocery-essentials')._id, variants: [{ size: '500g', price: 70, stock: 80 }, { size: '1kg', price: 135, originalPrice: 150, stock: 50 }], shopOwner: 'Grocery Store', tags: ['dal', 'moong'], orderCount: 150 },
      { name: 'Chana Dal', category: getCat('grocery-essentials')._id, variants: [{ size: '500g', price: 55, stock: 80 }, { size: '1kg', price: 105, stock: 50 }], shopOwner: 'Grocery Store', tags: ['dal', 'chana'], orderCount: 145 },
      { name: 'Fortune Oil', category: getCat('grocery-essentials')._id, variants: [{ size: '1L', price: 145, stock: 80 }, { size: '5L', price: 690, originalPrice: 725, stock: 30 }], shopOwner: 'Grocery Store', tags: ['oil', 'fortune'], orderCount: 195 },
      { name: 'Kissan Jam Mixed Fruit', category: getCat('grocery-essentials')._id, variants: [{ size: '200g', price: 75, stock: 60 }, { size: '500g', price: 175, originalPrice: 190, stock: 30 }], shopOwner: 'Grocery Store', tags: ['jam', 'kissan'], orderCount: 105 },
      { name: 'Tata Tea Gold', category: getCat('grocery-essentials')._id, variants: [{ size: '250g', price: 155, stock: 80 }, { size: '500g', price: 305, originalPrice: 320, stock: 40 }], shopOwner: 'Grocery Store', tags: ['tea', 'chai', 'tata'], orderCount: 175 },
      { name: 'Bru Coffee', category: getCat('grocery-essentials')._id, variants: [{ size: '50g', price: 155, stock: 60 }, { size: '100g', price: 290, originalPrice: 310, stock: 30 }], shopOwner: 'Grocery Store', tags: ['coffee', 'bru'], orderCount: 95 },
      { name: 'Everest Garam Masala', category: getCat('grocery-essentials')._id, variants: [{ size: '50g', price: 45, stock: 100 }, { size: '100g', price: 85, stock: 60 }], shopOwner: 'Grocery Store', tags: ['masala', 'spices'], orderCount: 110 },
      { name: 'Turmeric Powder (Haldi)', category: getCat('grocery-essentials')._id, variants: [{ size: '100g', price: 25, stock: 100 }, { size: '500g', price: 115, stock: 40 }], shopOwner: 'Grocery Store', tags: ['haldi', 'turmeric'], orderCount: 130 },
      { name: 'Red Chili Powder', category: getCat('grocery-essentials')._id, variants: [{ size: '100g', price: 35, stock: 80 }, { size: '500g', price: 165, stock: 30 }], shopOwner: 'Grocery Store', tags: ['chili powder', 'mirchi'], orderCount: 125 },

      // ============ MEDICINE & HEALTH ============
      { name: 'Paracetamol 500mg', category: getCat('medicine-and-health')._id, variants: [{ size: '10 tablets', price: 15, originalPrice: 17, stock: 200 }], shopOwner: 'Med Store', tags: ['medicine', 'fever', 'paracetamol'], orderCount: 220 },
      { name: 'Dolo 650', category: getCat('medicine-and-health')._id, variants: [{ size: '15 tablets', price: 30, originalPrice: 32, stock: 150 }], shopOwner: 'Med Store', tags: ['dolo', 'fever'], orderCount: 180 },
      { name: 'Crocin Advance', category: getCat('medicine-and-health')._id, variants: [{ size: '15 tablets', price: 30, stock: 120 }], shopOwner: 'Med Store', tags: ['crocin', 'fever'], orderCount: 140 },
      { name: 'Combiflam', category: getCat('medicine-and-health')._id, variants: [{ size: '20 tablets', price: 45, stock: 100 }], shopOwner: 'Med Store', tags: ['combiflam', 'pain'], orderCount: 95 },
      { name: 'Vicks VapoRub', category: getCat('medicine-and-health')._id, variants: [{ size: '25g', price: 100, stock: 60 }, { size: '50g', price: 175, originalPrice: 190, stock: 40 }], shopOwner: 'Med Store', tags: ['vicks', 'cold'], orderCount: 85 },
      { name: 'Bandaid Strips', category: getCat('medicine-and-health')._id, variants: [{ size: '10 pcs', price: 25, originalPrice: 30, stock: 100 }, { size: '30 pcs', price: 65, stock: 50 }], shopOwner: 'Med Store', tags: ['bandaid'], orderCount: 75 },
      { name: 'Dettol Antiseptic', category: getCat('medicine-and-health')._id, variants: [{ size: '125ml', price: 65, stock: 80 }, { size: '250ml', price: 125, originalPrice: 135, stock: 50 }], shopOwner: 'Med Store', tags: ['dettol', 'antiseptic'], orderCount: 110 },
      { name: 'Volini Spray', category: getCat('medicine-and-health')._id, variants: [{ size: '55g', price: 175, originalPrice: 195, stock: 40 }], shopOwner: 'Med Store', tags: ['volini', 'pain spray'], orderCount: 65 },
      { name: 'Sanitary Pads (Whisper)', category: getCat('medicine-and-health')._id, variants: [{ size: 'Pack of 6', price: 65, stock: 100 }, { size: 'Pack of 15', price: 145, originalPrice: 160, stock: 60 }], shopOwner: 'Med Store', tags: ['pads', 'whisper'], orderCount: 190 },
      { name: 'Hand Sanitizer', category: getCat('medicine-and-health')._id, variants: [{ size: '100ml', price: 45, stock: 100 }, { size: '500ml', price: 175, originalPrice: 195, stock: 50 }], shopOwner: 'Med Store', tags: ['sanitizer'], orderCount: 130 },
      { name: 'Multivitamin Tablets', category: getCat('medicine-and-health')._id, variants: [{ size: '30 tablets', price: 195, originalPrice: 220, stock: 60 }], shopOwner: 'Med Store', tags: ['vitamins', 'health'], orderCount: 80 },

      // ============ PERSONAL CARE ============
      { name: 'Colgate MaxFresh Toothpaste', category: getCat('personal-care')._id, variants: [{ size: '80g', price: 45, originalPrice: 55, stock: 100 }, { size: '150g', price: 85, originalPrice: 99, stock: 60 }], shopOwner: 'Campus Store', tags: ['toothpaste', 'colgate'], orderCount: 180 },
      { name: 'Sensodyne Toothpaste', category: getCat('personal-care')._id, variants: [{ size: '75g', price: 105, originalPrice: 120, stock: 60 }], shopOwner: 'Campus Store', tags: ['toothpaste', 'sensodyne'], orderCount: 95 },
      { name: 'Dettol Soap', category: getCat('personal-care')._id, variants: [{ size: '75g', price: 32, originalPrice: 42, stock: 200 }, { size: '125g', price: 55, originalPrice: 65, stock: 100 }], shopOwner: 'Campus Store', tags: ['soap', 'dettol'], orderCount: 240 },
      { name: 'Lifebuoy Soap', category: getCat('personal-care')._id, variants: [{ size: '75g', price: 22, stock: 200 }, { size: '125g', price: 45, stock: 100 }], shopOwner: 'Campus Store', tags: ['soap', 'lifebuoy'], orderCount: 200 },
      { name: 'Lux Soap', category: getCat('personal-care')._id, variants: [{ size: '100g', price: 40, stock: 150 }, { size: '150g', price: 55, stock: 80 }], shopOwner: 'Campus Store', tags: ['soap', 'lux'], orderCount: 170 },
      { name: 'Dove Soap', category: getCat('personal-care')._id, variants: [{ size: '75g', price: 55, stock: 100 }, { size: '125g', price: 95, originalPrice: 110, stock: 60 }], shopOwner: 'Campus Store', tags: ['soap', 'dove'], orderCount: 130 },
      { name: 'Head & Shoulders Shampoo', category: getCat('personal-care')._id, variants: [{ size: '80ml', price: 85, stock: 80 }, { size: '180ml', price: 175, originalPrice: 199, stock: 40 }, { size: '340ml', price: 315, originalPrice: 349, stock: 25 }], shopOwner: 'Campus Store', tags: ['shampoo', 'head shoulders'], orderCount: 145 },
      { name: 'Clinic Plus Shampoo', category: getCat('personal-care')._id, variants: [{ size: '80ml', price: 45, stock: 100 }, { size: '175ml', price: 95, originalPrice: 105, stock: 60 }], shopOwner: 'Campus Store', tags: ['shampoo', 'clinic plus'], orderCount: 155 },
      { name: 'Sunsilk Shampoo', category: getCat('personal-care')._id, variants: [{ size: '80ml', price: 55, stock: 80 }, { size: '180ml', price: 130, originalPrice: 145, stock: 50 }], shopOwner: 'Campus Store', tags: ['shampoo', 'sunsilk'], orderCount: 120 },
      { name: 'Himalaya Face Wash', category: getCat('personal-care')._id, variants: [{ size: '50ml', price: 95, originalPrice: 110, stock: 60 }, { size: '100ml', price: 175, originalPrice: 199, stock: 40 }], shopOwner: 'Campus Store', tags: ['face wash', 'himalaya'], orderCount: 110 },
      { name: 'Nivea Body Lotion', category: getCat('personal-care')._id, variants: [{ size: '75ml', price: 95, stock: 60 }, { size: '200ml', price: 195, originalPrice: 225, stock: 40 }], shopOwner: 'Campus Store', tags: ['lotion', 'nivea'], orderCount: 85 },
      { name: 'Fair & Lovely Cream', category: getCat('personal-care')._id, variants: [{ size: '25g', price: 55, stock: 100 }, { size: '80g', price: 145, originalPrice: 160, stock: 50 }], shopOwner: 'Campus Store', tags: ['cream', 'fair lovely'], orderCount: 130 },
      { name: 'Ponds Talcum Powder', category: getCat('personal-care')._id, variants: [{ size: '100g', price: 65, stock: 80 }, { size: '400g', price: 195, originalPrice: 215, stock: 40 }], shopOwner: 'Campus Store', tags: ['powder', 'ponds'], orderCount: 95 },
      { name: 'Gillette Razor', category: getCat('personal-care')._id, variants: [{ size: 'Single', price: 55, stock: 100 }, { size: 'Pack of 3', price: 145, originalPrice: 165, stock: 60 }], shopOwner: 'Campus Store', tags: ['razor', 'gillette'], orderCount: 105 },
      { name: 'Old Spice Deo', category: getCat('personal-care')._id, variants: [{ size: '150ml', price: 195, originalPrice: 220, stock: 50 }], shopOwner: 'Campus Store', tags: ['deo', 'old spice'], orderCount: 75 },
      { name: 'Fogg Deodorant', category: getCat('personal-care')._id, variants: [{ size: '150ml', price: 175, originalPrice: 195, stock: 60 }], shopOwner: 'Campus Store', tags: ['deo', 'fogg'], orderCount: 90 },

      // ============ SNACKS & FAST FOOD ============
      { name: 'Lays Classic Salted', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '52g', price: 20, stock: 300 }, { size: '90g', price: 30, stock: 200 }], shopOwner: 'Snack Corner', tags: ['chips', 'lays'], orderCount: 250 },
      { name: 'Lays Magic Masala', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '52g', price: 20, stock: 300 }, { size: '90g', price: 30, stock: 200 }], shopOwner: 'Snack Corner', tags: ['chips', 'lays', 'masala'], orderCount: 245 },
      { name: 'Kurkure Masala Munch', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '35g', price: 10, stock: 300 }, { size: '90g', price: 20, originalPrice: 25, stock: 200 }], shopOwner: 'Snack Corner', tags: ['kurkure'], orderCount: 220 },
      { name: 'Bingo Mad Angles', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '35g', price: 10, stock: 200 }, { size: '90g', price: 20, stock: 150 }], shopOwner: 'Snack Corner', tags: ['bingo', 'chips'], orderCount: 145 },
      { name: 'Haldiram Bhujia', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '150g', price: 45, stock: 100 }, { size: '400g', price: 115, originalPrice: 125, stock: 50 }], shopOwner: 'Snack Corner', tags: ['bhujia', 'haldiram', 'namkeen'], orderCount: 175 },
      { name: 'Haldiram Aloo Bhujia', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '150g', price: 45, stock: 100 }, { size: '400g', price: 115, stock: 50 }], shopOwner: 'Snack Corner', tags: ['bhujia', 'aloo'], orderCount: 165 },
      { name: 'Dairy Milk Chocolate', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '13g', price: 10, stock: 300 }, { size: '50g', price: 50, stock: 150 }, { size: '110g', price: 100, stock: 80 }], shopOwner: 'Snack Corner', tags: ['chocolate', 'dairy milk'], orderCount: 280 },
      { name: 'Kitkat Chocolate', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '2 fingers', price: 10, stock: 300 }, { size: '4 fingers', price: 25, stock: 150 }], shopOwner: 'Snack Corner', tags: ['kitkat', 'chocolate'], orderCount: 210 },
      { name: '5 Star Chocolate', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '22g', price: 10, stock: 300 }, { size: '45g', price: 25, stock: 150 }], shopOwner: 'Snack Corner', tags: ['5 star', 'chocolate'], orderCount: 180 },
      { name: 'Perk Chocolate', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '13g', price: 10, stock: 300 }], shopOwner: 'Snack Corner', tags: ['perk', 'chocolate'], orderCount: 160 },
      { name: 'Munch Chocolate', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '18g', price: 10, stock: 300 }], shopOwner: 'Snack Corner', tags: ['munch', 'chocolate'], orderCount: 155 },
      { name: 'Uncle Chips', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '48g', price: 20, stock: 200 }], shopOwner: 'Snack Corner', tags: ['chips', 'uncle chips'], orderCount: 125 },
      { name: 'Nachos', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '150g', price: 65, stock: 100 }], shopOwner: 'Snack Corner', tags: ['nachos'], orderCount: 85 },
      { name: 'Cup Noodles', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '70g', price: 45, stock: 150 }], shopOwner: 'Snack Corner', tags: ['cup noodles', 'maggi'], orderCount: 175 },
      { name: 'Oreo Biscuit', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '50g', price: 15, stock: 200 }, { size: '120g', price: 30, stock: 100 }], shopOwner: 'Snack Corner', tags: ['oreo', 'biscuit'], orderCount: 195 },
      { name: 'Hide & Seek Biscuit', category: getCat('snacks-and-fast-food')._id, variants: [{ size: '100g', price: 30, stock: 150 }, { size: '250g', price: 65, originalPrice: 75, stock: 80 }], shopOwner: 'Snack Corner', tags: ['hide seek', 'biscuit'], orderCount: 155 },

      // ============ STATIONERY ============
      { name: 'Classmate Notebook', category: getCat('stationery')._id, variants: [{ size: '180 pages', price: 40, originalPrice: 45, stock: 150 }, { size: '240 pages', price: 55, originalPrice: 60, stock: 100 }, { size: '400 pages', price: 95, originalPrice: 110, stock: 50 }], shopOwner: 'Stationery Hub', tags: ['notebook', 'classmate'], orderCount: 195 },
      { name: 'Camlin Register', category: getCat('stationery')._id, variants: [{ size: '200 pages', price: 65, stock: 80 }, { size: '400 pages', price: 115, originalPrice: 130, stock: 40 }], shopOwner: 'Stationery Hub', tags: ['register', 'camlin'], orderCount: 110 },
      { name: 'Reynolds Ball Pen', category: getCat('stationery')._id, variants: [{ size: 'Single', price: 10, stock: 500 }, { size: 'Pack of 5', price: 45, stock: 200 }, { size: 'Pack of 10', price: 90, stock: 100 }], shopOwner: 'Stationery Hub', tags: ['pen', 'reynolds'], orderCount: 280 },
      { name: 'Cello Butterflow Pen', category: getCat('stationery')._id, variants: [{ size: 'Single', price: 10, stock: 400 }, { size: 'Pack of 5', price: 45, stock: 150 }], shopOwner: 'Stationery Hub', tags: ['pen', 'cello'], orderCount: 195 },
      { name: 'Natraj Pencil', category: getCat('stationery')._id, variants: [{ size: 'Single', price: 5, stock: 500 }, { size: 'Pack of 10', price: 45, stock: 150 }], shopOwner: 'Stationery Hub', tags: ['pencil', 'natraj'], orderCount: 240 },
      { name: 'Apsara Pencil', category: getCat('stationery')._id, variants: [{ size: 'Pack of 10', price: 40, stock: 200 }], shopOwner: 'Stationery Hub', tags: ['pencil', 'apsara'], orderCount: 180 },
      { name: 'Nataraj Eraser', category: getCat('stationery')._id, variants: [{ size: 'Single', price: 5, stock: 400 }, { size: 'Pack of 10', price: 40, stock: 150 }], shopOwner: 'Stationery Hub', tags: ['eraser'], orderCount: 165 },
      { name: 'Faber Castell Sharpener', category: getCat('stationery')._id, variants: [{ size: 'Single', price: 15, stock: 200 }, { size: 'Pack of 5', price: 65, stock: 100 }], shopOwner: 'Stationery Hub', tags: ['sharpener'], orderCount: 130 },
      { name: 'A4 Paper (100 sheets)', category: getCat('stationery')._id, variants: [{ size: '100 sheets', price: 95, stock: 100 }, { size: '500 sheets', price: 445, originalPrice: 475, stock: 40 }], shopOwner: 'Stationery Hub', tags: ['paper', 'a4'], orderCount: 145 },
      { name: 'Camlin Geometry Box', category: getCat('stationery')._id, variants: [{ size: 'Standard', price: 145, originalPrice: 165, stock: 80 }], shopOwner: 'Stationery Hub', tags: ['geometry', 'compass'], orderCount: 95 },
      { name: 'Stapler with Pins', category: getCat('stationery')._id, variants: [{ size: 'Small', price: 65, stock: 60 }, { size: 'Medium', price: 125, stock: 40 }], shopOwner: 'Stationery Hub', tags: ['stapler'], orderCount: 75 },
      { name: 'Fevistick Glue', category: getCat('stationery')._id, variants: [{ size: '8g', price: 25, stock: 200 }, { size: '15g', price: 45, stock: 100 }], shopOwner: 'Stationery Hub', tags: ['glue', 'fevistick'], orderCount: 145 },
      { name: 'Highlighter Marker', category: getCat('stationery')._id, variants: [{ size: 'Single', price: 25, stock: 200 }, { size: 'Pack of 5', price: 115, originalPrice: 125, stock: 80 }], shopOwner: 'Stationery Hub', tags: ['highlighter', 'marker'], orderCount: 125 },
      { name: 'Scientific Calculator', category: getCat('stationery')._id, variants: [{ size: 'Casio FX-991ES', price: 1195, originalPrice: 1295, stock: 30 }, { size: 'Basic', price: 195, stock: 60 }], shopOwner: 'Stationery Hub', tags: ['calculator', 'casio'], orderCount: 65 }
    ]);
    console.log('✅ Products created (100+)');

    // Reptro Fresh items
    await ReptroFresh.insertMany([
      {
        name: 'Classic Sprout Bowl',
        type: 'sprout',
        description: 'Fresh mixed sprouts with veggies',
        shopOwner: 'Reptro Fresh',
        singleBowlPrice: 34,
        singleBowlOriginalPrice: 45,
        bowlSize: '100g Bowl',
        monthlyPrice: 849,
        monthlyOriginalPrice: 1350,
        monthlyDays: 30,
        healthBenefits: 'High in protein, fiber, vitamin C, and folate. Boosts immunity & digestion.',
        isAvailable: true,
        isFeatured: true,
        stock: 50,
        orderCount: 60
      },
      {
        name: 'Moong Sprouts',
        type: 'sprout',
        description: 'Fresh green moong sprouts, packed with protein',
        shopOwner: 'Reptro Fresh',
        singleBowlPrice: 25,
        singleBowlOriginalPrice: 35,
        bowlSize: '100g Bowl',
        monthlyPrice: 649,
        monthlyOriginalPrice: 1050,
        monthlyDays: 30,
        healthBenefits: 'Rich in protein and easy to digest',
        isAvailable: true,
        isFeatured: true,
        stock: 40,
        orderCount: 45
      },
      {
        name: 'Fresh Fruit Bowl',
        type: 'fruit',
        description: 'Mix of seasonal fresh fruits',
        shopOwner: 'Reptro Fresh',
        singleBowlPrice: 60,
        singleBowlOriginalPrice: 80,
        bowlSize: '200g Bowl',
        monthlyPrice: 1499,
        monthlyOriginalPrice: 2400,
        monthlyDays: 30,
        healthBenefits: 'Rich in fiber, vitamin C. Supports heart health & immunity.',
        isAvailable: true,
        isFeatured: false,
        stock: 30,
        orderCount: 40
      },
      {
        name: 'Banana Bowl',
        type: 'fruit',
        description: 'Fresh yellow bananas for energy',
        shopOwner: 'Reptro Fresh',
        singleBowlPrice: 30,
        singleBowlOriginalPrice: 40,
        bowlSize: '4 pieces',
        monthlyPrice: 749,
        monthlyOriginalPrice: 1200,
        monthlyDays: 30,
        healthBenefits: 'Great source of potassium and instant energy',
        isAvailable: true,
        isFeatured: false,
        stock: 60,
        orderCount: 55
      }
    ]);
    console.log('✅ Reptro Fresh items created');

    console.log('\n🎉 Seed completed!');
    console.log('📧 Admin: admin@reptro.in');
    console.log('🔑 Password: Reptro@Admin2024');
    console.log('📦 Total Products: 100+');
    console.log('🌱 Reptro Fresh Items: 4');
  } catch (error) { console.error('❌ Seed error:', error); }
};

if (require.main === module) { seedData().then(() => process.exit()); }
module.exports = seedData;