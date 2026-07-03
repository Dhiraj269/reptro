const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Admin login (still keep for admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated.' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
    
    user.lastLogin = new Date();
    await user.save();
    
    res.json({
      _id: user._id, name: user.name, email: user.email, phone: user.phone,
      role: user.role, selectedLocation: user.selectedLocation,
      deliveryAddress: user.deliveryAddress, profilePic: user.profilePic,
      loginMethod: user.loginMethod, token: generateToken(user._id)
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Google Login - Step 1: Verify Google Token
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) return res.status(400).json({ message: 'No credential provided' });

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Existing user - update Google info
      user.googleId = googleId;
      user.profilePic = picture;
      user.loginMethod = 'google';
      user.isEmailVerified = true;
      user.lastLogin = new Date();
      await user.save();

      if (!user.phone || user.phone === 'pending') {
        return res.json({
          needsPhone: true,
          tempData: { googleId, email, name, picture }
        });
      }

      return res.json({
        _id: user._id, name: user.name, email: user.email, phone: user.phone,
        role: user.role, selectedLocation: user.selectedLocation,
        deliveryAddress: user.deliveryAddress, profilePic: user.profilePic,
        loginMethod: 'google', token: generateToken(user._id)
      });
    }

    // New user - needs phone number
    res.json({
      needsPhone: true,
      tempData: { googleId, email, name, picture }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed: ' + error.message });
  }
});

// Google Login - Step 2: Complete registration with phone
router.post('/google/complete', async (req, res) => {
  try {
    const { googleId, email, name, picture, phone } = req.body;

    if (!phone || phone.length < 10) {
      return res.status(400).json({ message: 'Valid phone number required' });
    }

    let user = await User.findOne({ email });

    if (user) {
      user.phone = phone;
      user.googleId = googleId;
      user.profilePic = picture;
      user.name = user.name || name;
      user.loginMethod = 'google';
      user.isEmailVerified = true;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        phone,
        googleId,
        profilePic: picture,
        loginMethod: 'google',
        isEmailVerified: true,
        password: ''
      });
    }

    res.json({
      _id: user._id, name: user.name, email: user.email, phone: user.phone,
      role: user.role, selectedLocation: user.selectedLocation,
      deliveryAddress: user.deliveryAddress, profilePic: user.profilePic,
      loginMethod: 'google', token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Complete registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.selectedLocation) {
      user.selectedLocation = req.body.selectedLocation;
      user.deliveryAddress = req.body.selectedLocation;
    }
    if (req.body.deliveryAddress) user.deliveryAddress = req.body.deliveryAddress;
    if (req.body.notifications !== undefined) user.notifications = req.body.notifications;
    if (req.body.darkMode !== undefined) user.darkMode = req.body.darkMode;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
      phone: updatedUser.phone, role: updatedUser.role,
      selectedLocation: updatedUser.selectedLocation,
      deliveryAddress: updatedUser.deliveryAddress,
      profilePic: updatedUser.profilePic,
      loginMethod: updatedUser.loginMethod,
      notifications: updatedUser.notifications,
      darkMode: updatedUser.darkMode,
      token: generateToken(updatedUser._id)
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;