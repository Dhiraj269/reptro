import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('reptro_user') || 'null');
  if (user?.token) config.headers.Authorization = 'Bearer ' + user.token;
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  googleLogin: (credential) => api.post('/auth/google', { credential }),
  googleComplete: (data) => api.post('/auth/google/complete', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getPopular: () => api.get('/products/popular'),
  getFresh: () => api.get('/products/fresh'),
  getFlashSale: () => api.get('/products/flashsale'),
  getSuggestions: (q) => api.get('/products/suggestions', { params: { q } }),
  getById: (id) => api.get('/products/' + id),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put('/products/' + id, data),
  delete: (id) => api.delete('/products/' + id)
};

export const reptroFreshAPI = {
  getAll: () => api.get('/reptrofresh'),
  getAllAdmin: () => api.get('/reptrofresh/all'),
  create: (data) => api.post('/reptrofresh', data),
  update: (id, data) => api.put('/reptrofresh/' + id, data),
  delete: (id) => api.delete('/reptrofresh/' + id)
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getAllAdmin: () => api.get('/categories/all'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put('/categories/' + id, data),
  delete: (id) => api.delete('/categories/' + id),
  toggle: (id) => api.put('/categories/' + id + '/toggle')
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  trackOrder: (orderNumber) => api.get('/orders/track/' + orderNumber),
  getAllOrders: () => api.get('/orders/all'),
  getOrderDetails: (id) => api.get('/orders/details/' + id),
  updateStatus: (id, status, message) => api.put('/orders/' + id + '/status', { status, message })
};

export const locationAPI = {
  getAll: () => api.get('/locations'),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put('/locations/' + id, data),
  delete: (id) => api.delete('/locations/' + id)
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUser: (id) => api.put('/admin/users/' + id + '/toggle')
};

export const uploadAPI = {
  upload: (formData) => api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
};

export default api;