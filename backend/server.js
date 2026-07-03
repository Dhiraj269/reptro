const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ status: 'Reptro API is running!', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Load routes with error handling
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes loaded');
} catch(e) { console.log('❌ Auth routes error:', e.message); }

try {
  app.use('/api/products', require('./routes/products'));
  console.log('✅ Products routes loaded');
} catch(e) { console.log('❌ Products routes error:', e.message); }

try {
  app.use('/api/categories', require('./routes/categories'));
  console.log('✅ Categories routes loaded');
} catch(e) { console.log('❌ Categories routes error:', e.message); }

try {
  app.use('/api/orders', require('./routes/orders'));
  console.log('✅ Orders routes loaded');
} catch(e) { console.log('❌ Orders routes error:', e.message); }

try {
  app.use('/api/locations', require('./routes/locations'));
  console.log('✅ Locations routes loaded');
} catch(e) { console.log('❌ Locations routes error:', e.message); }

try {
  app.use('/api/admin', require('./routes/admin'));
  console.log('✅ Admin routes loaded');
} catch(e) { console.log('❌ Admin routes error:', e.message); }

try {
  app.use('/api/upload', require('./routes/upload'));
  console.log('✅ Upload routes loaded');
} catch(e) { console.log('❌ Upload routes error:', e.message); }

try {
  app.use('/api/reptrofresh', require('./routes/reptrofresh'));
  console.log('✅ ReptroFresh routes loaded');
} catch(e) { console.log('❌ ReptroFresh routes error:', e.message); }

// Seed route
app.get('/api/seed-database-secret-2024', async (req, res) => {
  try {
    const seedData = require('./seed');
    await seedData();
    res.json({ success: true, message: 'Database seeded!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server running on port ' + PORT));