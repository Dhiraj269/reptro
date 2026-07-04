// Calculate delivery charge
export const calculateDeliveryCharge = (totalItems, deliveryType) => {
  if (deliveryType === 'fast') return 20;
  const slabs = Math.ceil(totalItems / 4);
  return slabs * 9;
};

// Format price
export const formatPrice = (price) => {
  return `₹${price}`;
};

// Generate CAPTCHA
export const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let captcha = '';
  for (let i = 0; i < 5; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

// Fuzzy search helper - simple Levenshtein distance
export const fuzzyMatch = (str1, str2) => {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  if (str1.includes(str2) || str2.includes(str1)) return true;
  
  // Simple spelling correction
  const corrections = {
    'maggii': 'maggi',
    'magi': 'maggi',
    'millk': 'milk',
    'milkk': 'milk',
    'chipse': 'chips',
    'bred': 'bread',
    'biscit': 'biscuit',
    'choklate': 'chocolate',
    'sop': 'soap',
    'shampu': 'shampoo',
    'tothpaste': 'toothpaste',
    'noddles': 'noodles',
    'egs': 'eggs',
    'medicin': 'medicine'
  };

  if (corrections[str2]) {
    return str1.includes(corrections[str2]);
  }

  return false;
};

// WhatsApp URL generator
export const getWhatsAppURL = (message = '') => {
  const phone = '919279167527';
  const encodedMessage = encodeURIComponent(message || 'Hi Reptro! I would like to place an order.');
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

export const getImageURL = (path) => {
  if (!path) return null;
  // If already full URL (Cloudinary), return as-is
  if (path.startsWith('http')) return path;
  // Legacy local URLs
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const BASE_URL = API_BASE.replace('/api', '');
  return BASE_URL + path;
};