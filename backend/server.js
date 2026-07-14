const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const app = express();

// CORS - Allow all origins
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Reptro API is running!', 
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reptrofresh', require('./routes/reptrofresh'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// Seed route (remove after using)
app.get('/api/seed-database-secret-2024', async (req, res) => {
  try {
    const seedData = require('./seed');
    await seedData();
    res.json({
      success: true,
      message: 'Database seeded successfully!',
      admin: {
        email: 'admin@reptro.in',
        password: 'Reptro@Admin2024'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});
// TEMPORARY - Test Cloudinary Configuration
app.get('/api/test-cloudinary', (req, res) => {
  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME 
      ? '✅ Set: ' + process.env.CLOUDINARY_CLOUD_NAME 
      : '❌ MISSING',
    apiKey: process.env.CLOUDINARY_API_KEY 
      ? '✅ Set: ' + process.env.CLOUDINARY_API_KEY.substring(0, 5) + '...' 
      : '❌ MISSING',
    apiSecret: process.env.CLOUDINARY_API_SECRET 
      ? '✅ Set (hidden for security)' 
      : '❌ MISSING',
    message: 'If all 3 are ✅ Set, Cloudinary is configured properly'
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server running on port ' + PORT));