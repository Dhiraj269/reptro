const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Configure Cloudinary with debug logging
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log config on startup
console.log('☁️ Cloudinary Config:');
console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('   API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reptro',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ 
      width: 800, 
      height: 800, 
      crop: 'limit', 
      quality: 'auto',
      fetch_format: 'auto'
    }]
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', protect, admin, (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('❌ Multer Error:', err.message);
      return res.status(400).json({ message: 'Upload error: ' + err.message });
    }
    
    if (!req.file) {
      console.error('❌ No file received');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('✅ Upload successful:', req.file.path);
    
    res.json({
      url: req.file.path,
      filename: req.file.filename,
      message: 'Uploaded successfully!'
    });
  });
});

module.exports = router;