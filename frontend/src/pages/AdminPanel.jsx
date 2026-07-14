import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { adminAPI, productAPI, categoryAPI, orderAPI, locationAPI, uploadAPI, reptroFreshAPI, subscriptionAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [freshItems, setFreshItems] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
const [freshItemsAdmin, setFreshItemsAdmin] = useState([]);
const [showSubForm, setShowSubForm] = useState(false);
const [selectedSubForAttendance, setSelectedSubForAttendance] = useState(null);
const [subForm, setSubForm] = useState({
  userId: '',
  freshItemId: '',
  startDate: new Date().toISOString().split('T')[0],
  paymentMethod: 'cod',
  notes: ''
});
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newLocationName, setNewLocationName] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', category: '', shopOwner: '', image: '',
    isFeatured: false, isFlashSale: false, flashSaleDiscount: 0,
    variants: [{ size: '', price: '', originalPrice: '', stock: '', locationPrices: [] }],
    tags: ''
  });
  // Category management states
const [showCategoryForm, setShowCategoryForm] = useState(false);
const [editingCategory, setEditingCategory] = useState(null);
const [categoryForm, setCategoryForm] = useState({
  name: '',
  icon: '📦',
  subtitle: 'Fresh & delivered fast',
  isActive: true
});

  // Reptro Fresh form
  const [showFreshForm, setShowFreshForm] = useState(false);
  const [editingFresh, setEditingFresh] = useState(null);
  const [freshForm, setFreshForm] = useState({
    name: '', type: 'sprout', description: '', shopOwner: 'Reptro Fresh', image: '',
    singleBowlPrice: '', singleBowlOriginalPrice: '', bowlSize: 'Single Bowl',
    monthlyPrice: '', monthlyOriginalPrice: '', monthlyDays: 30,
    healthBenefits: '', stock: 100, isAvailable: true, isFeatured: false
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') { toast.error('Admin only!'); navigate('/'); return; }
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
  try {
    if (activeTab === 'dashboard') {
      const { data } = await adminAPI.getStats();
      setStats(data);
      // Also fetch products for dashboard
      const prodRes = await productAPI.getAll({});
      setProducts(prodRes.data);
    }
    if (activeTab === 'products') {
      const prodRes = await productAPI.getAll({});
      setProducts(prodRes.data);
      const catRes = await categoryAPI.getAll();
      setCategories(catRes.data);
      const locRes = await locationAPI.getAll();
      setLocations(locRes.data);
    }
    if (activeTab === 'categories') {
  const { data } = await categoryAPI.getAllAdmin();
  setCategories(data);
}
    if (activeTab === 'orders') {
      const { data } = await orderAPI.getAllOrders();
      setOrders(data);
    }
    if (activeTab === 'locations') {
      const { data } = await locationAPI.getAll();
      setLocations(data);
    }
    
    if (activeTab === 'users') {
      const { data } = await adminAPI.getUsers();
      setUsers(data);
    }
    if (activeTab === 'reptrofresh') {
      try {
        const { data } = await reptroFreshAPI.getAllAdmin();
        console.log('Reptro Fresh Items:', data);
        setFreshItems(data);
      } catch (err) {
        console.error('Fresh fetch error:', err);
        // Try public route as fallback
        try {
          const { data } = await reptroFreshAPI.getAll();
          setFreshItems(data);
        } catch (e) {
          toast.error('Failed to load fresh items');
        }
      }
    }
    if (activeTab === 'subscriptions') {
  const subRes = await subscriptionAPI.getAllAdmin();
  setSubscriptions(subRes.data);
  const usersRes = await adminAPI.getUsers();
  setUsers(usersRes.data);
  const freshRes = await reptroFreshAPI.getAllAdmin();
  setFreshItemsAdmin(freshRes.data);
}
  } catch (e) {
    console.error('Fetch error:', e);
  }
};

  const handleImageUpload = async (e, target = 'product') => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('image', file);
    try {
      const { data } = await uploadAPI.upload(fd);
      if (target === 'fresh') setFreshForm(p => ({ ...p, image: data.url }));
      else setForm(p => ({ ...p, image: data.url }));
      toast.success('Uploaded!');
    } catch (e) { toast.error('Upload failed'); }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        variants: form.variants.map(v => ({
          ...v,
          price: Number(v.price),
          originalPrice: Number(v.originalPrice) || Number(v.price),
          stock: Number(v.stock) || 0,
          locationPrices: v.locationPrices || []
        }))
      };
      if (editingProduct) { await productAPI.update(editingProduct._id, payload); toast.success('Updated!'); }
      else { await productAPI.create(payload); toast.success('Created!'); }
      setShowForm(false); setEditingProduct(null); resetForm(); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const resetForm = () => setForm({
    name: '', description: '', category: '', shopOwner: '', image: '',
    isFeatured: false, isFlashSale: false, flashSaleDiscount: 0,
    variants: [{ size: '', price: '', originalPrice: '', stock: '', locationPrices: [] }],
    tags: ''
  });

  const handleEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name, description: p.description || '', category: p.category?._id || p.category,
      shopOwner: p.shopOwner || '', image: p.image || '',
      isFeatured: p.isFeatured || false,
      isFlashSale: p.isFlashSale || false, flashSaleDiscount: p.flashSaleDiscount || 0,
      variants: p.variants?.map(v => ({ ...v, locationPrices: v.locationPrices || [] })) || [{ size: '', price: '', originalPrice: '', stock: '', locationPrices: [] }],
      tags: (p.tags || []).join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await productAPI.delete(id); toast.success('Deleted'); fetchData(); } catch (e) { toast.error('Failed'); } };
  const handleOrderStatus = async (id, status) => { try { await orderAPI.updateStatus(id, status); toast.success('Updated'); fetchData(); } catch (e) { toast.error('Failed'); } };
  const handleToggleLocation = async (loc) => { try { await locationAPI.update(loc._id, { isActive: !loc.isActive }); toast.success(loc.name + ' updated'); fetchData(); } catch (e) { toast.error('Failed'); } };
  const handleDeleteLocation = async (loc) => { if (loc.isDefault) { toast.error('Cannot delete default!'); return; } if (!window.confirm('Delete ' + loc.name + '?')) return; try { await locationAPI.delete(loc._id); toast.success('Deleted!'); fetchData(); } catch (e) { toast.error('Failed'); } };
  const handleAddLocation = async () => { if (!newLocationName.trim()) { toast.error('Enter name!'); return; } try { await locationAPI.create({ name: newLocationName.trim() }); toast.success('Added!'); setNewLocationName(''); fetchData(); } catch (e) { toast.error(e.response?.data?.message || 'Failed'); } };
  const handleToggleUser = async (id) => { try { await adminAPI.toggleUser(id); toast.success('Updated'); fetchData(); } catch (e) { toast.error('Failed'); } };

  const addVariant = () => setForm(p => ({ ...p, variants: [...p.variants, { size: '', price: '', originalPrice: '', stock: '', locationPrices: [] }] }));
  const removeVariant = (i) => setForm(p => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }));
  const updateVariant = (i, field, val) => setForm(p => ({ ...p, variants: p.variants.map((v, idx) => idx === i ? { ...v, [field]: val } : v) }));

  const addLocationPrice = (variantIdx, locName) => {
    setForm(p => ({
      ...p,
      variants: p.variants.map((v, i) => {
        if (i !== variantIdx) return v;
        const existing = (v.locationPrices || []).find(lp => lp.location === locName);
        if (existing) return v;
        return { ...v, locationPrices: [...(v.locationPrices || []), { location: locName, price: v.price, originalPrice: v.originalPrice }] };
      })
    }));
  };

  const updateLocationPrice = (variantIdx, locIdx, field, val) => {
    setForm(p => ({
      ...p,
      variants: p.variants.map((v, i) => {
        if (i !== variantIdx) return v;
        return { ...v, locationPrices: v.locationPrices.map((lp, li) => li === locIdx ? { ...lp, [field]: val } : lp) };
      })
    }));
  };

  const removeLocationPrice = (variantIdx, locIdx) => {
    setForm(p => ({
      ...p,
      variants: p.variants.map((v, i) => {
        if (i !== variantIdx) return v;
        return { ...v, locationPrices: v.locationPrices.filter((_, li) => li !== locIdx) };
      })
    }));
  };

  // Reptro Fresh handlers
  const resetFreshForm = () => setFreshForm({
    name: '', type: 'sprout', description: '', shopOwner: 'Reptro Fresh', image: '',
    singleBowlPrice: '', singleBowlOriginalPrice: '', bowlSize: 'Single Bowl',
    monthlyPrice: '', monthlyOriginalPrice: '', monthlyDays: 30,
    healthBenefits: '', stock: 100, isAvailable: true, isFeatured: false
  });

  const handleEditFresh = (item) => {
    setEditingFresh(item);
    setFreshForm({
      name: item.name,
      type: item.type,
      description: item.description || '',
      shopOwner: item.shopOwner || 'Reptro Fresh',
      image: item.image || '',
      singleBowlPrice: item.singleBowlPrice,
      singleBowlOriginalPrice: item.singleBowlOriginalPrice || '',
      bowlSize: item.bowlSize || 'Single Bowl',
      monthlyPrice: item.monthlyPrice,
      monthlyOriginalPrice: item.monthlyOriginalPrice || '',
      monthlyDays: item.monthlyDays || 30,
      healthBenefits: item.healthBenefits || '',
      stock: item.stock || 100,
      isAvailable: item.isAvailable !== false,
      isFeatured: item.isFeatured || false
    });
    setShowFreshForm(true);
  };

  const handleFreshSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...freshForm,
        singleBowlPrice: Number(freshForm.singleBowlPrice),
        singleBowlOriginalPrice: Number(freshForm.singleBowlOriginalPrice) || null,
        monthlyPrice: Number(freshForm.monthlyPrice),
        monthlyOriginalPrice: Number(freshForm.monthlyOriginalPrice) || null,
        monthlyDays: Number(freshForm.monthlyDays),
        stock: Number(freshForm.stock)
      };
      if (editingFresh) { await reptroFreshAPI.update(editingFresh._id, payload); toast.success('Updated!'); }
      else { await reptroFreshAPI.create(payload); toast.success('Created!'); }
      setShowFreshForm(false); setEditingFresh(null); resetFreshForm(); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const handleDeleteFresh = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await reptroFreshAPI.delete(id); toast.success('Deleted'); fetchData(); }
    catch (e) { toast.error('Failed'); }
  };

  // Calculate savings preview
  const calcSavings = () => {
    const daily = Number(freshForm.singleBowlPrice) * Number(freshForm.monthlyDays);
    const monthly = Number(freshForm.monthlyPrice);
    const save = daily - monthly;
    const percent = daily > 0 ? Math.round((save / daily) * 100) : 0;
    return { daily, save, percent };
  };
  // Category handlers
const resetCategoryForm = () => setCategoryForm({
  name: '',
  icon: '📦',
  subtitle: 'Fresh & delivered fast',
  isActive: true
});

const handleEditCategory = (cat) => {
  setEditingCategory(cat);
  setCategoryForm({
    name: cat.name,
    icon: cat.icon || '📦',
    subtitle: cat.subtitle || '',
    isActive: cat.isActive
  });
  setShowCategoryForm(true);
};

const handleCategorySubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingCategory) {
      await categoryAPI.update(editingCategory._id, categoryForm);
      toast.success('Category updated!');
    } else {
      await categoryAPI.create(categoryForm);
      toast.success('Category created!');
    }
    setShowCategoryForm(false);
    setEditingCategory(null);
    resetCategoryForm();
    fetchData();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed');
  }
};

const handleDeleteCategory = async (id, name) => {
  if (!window.confirm('Delete category "' + name + '"? This will fail if products exist in this category.')) return;
  try {
    await categoryAPI.delete(id);
    toast.success('Category deleted!');
    fetchData();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Delete failed');
  }
};

const handleToggleCategory = async (id) => {
  try {
    await categoryAPI.toggle(id);
    toast.success('Status updated!');
    fetchData();
  } catch (error) {
    toast.error('Failed to update');
  }
};
// Subscription handlers
const handleCreateSubscription = async (e) => {
  e.preventDefault();
  try {
    await subscriptionAPI.create(subForm);
    toast.success('Subscription activated!');
    setShowSubForm(false);
    setSubForm({ userId: '', freshItemId: '', startDate: new Date().toISOString().split('T')[0], paymentMethod: 'cod', notes: '' });
    fetchData();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed');
  }
};

const handleSubStatus = async (id, status) => {
  try {
    await subscriptionAPI.updateStatus(id, status);
    toast.success('Updated!');
    fetchData();
  } catch (error) { toast.error('Failed'); }
};

const handleMarkAttendance = async (subId, dateIndex, status) => {
  try {
    await subscriptionAPI.markAttendance(subId, dateIndex, { status });
    toast.success(`Marked as ${status}`);
    const updated = await subscriptionAPI.getDetails(subId);
    setSelectedSubForAttendance(updated.data);
    fetchData();
  } catch (error) { toast.error('Failed'); }
};

const handleBulkAttendance = async () => {
  if (!window.confirm('Mark today as DELIVERED for all active subscriptions?')) return;
  try {
    const { data } = await subscriptionAPI.bulkAttendance('delivered');
    toast.success(`${data.count} marked!`);
    fetchData();
  } catch (error) { toast.error('Failed'); }
};

const handleDeleteSubscription = async (id) => {
  if (!window.confirm('Delete this subscription?')) return;
  try {
    await subscriptionAPI.delete(id);
    toast.success('Deleted!');
    fetchData();
  } catch (error) { toast.error('Failed'); }
};
  if (!user || user.role !== 'admin') return null;
  const tabs = ['dashboard', 'products', 'reptrofresh', 'subscriptions', 'orders', 'categories', 'locations', 'users'];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><button className="back-btn" onClick={() => navigate('/')}><FiArrowLeft /></button><h1>Admin Panel</h1></div>
      </div>
      <div className="admin-tabs">
        {tabs.map(t => (
          <button key={t} className={'admin-tab ' + (activeTab === t ? 'active' : '')} onClick={() => setActiveTab(t)}>
            {t === 'reptrofresh' ? '🌱 Reptro Fresh' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div>
          <div className="admin-stats">
            <div className="stat-card"><h4>Users</h4><div className="stat-value">{stats.totalUsers || 0}</div></div>
            <div className="stat-card"><h4>Orders</h4><div className="stat-value">{stats.totalOrders || 0}</div></div>
            <div className="stat-card"><h4>Products</h4><div className="stat-value">{stats.totalProducts || 0}</div></div>
            <div className="stat-card"><h4>Revenue</h4><div className="stat-value">₹{stats.totalRevenue || 0}</div></div>
          </div>
          {stats.recentOrders?.length > 0 && (
            <div className="admin-table"><h3 style={{ padding: '16px', fontWeight: 700 }}>Recent Orders</h3><div className="table-responsive"><table><thead><tr><th>Order#</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>
              {stats.recentOrders.map(o => <tr key={o._id}><td style={{ fontWeight: 600 }}>{o.orderNumber || '-'}</td><td>{o.user?.name}</td><td>{o.totalItems}</td><td>₹{o.total}</td><td><span className={'status-badge status-' + o.status}>{o.status}</span></td><td>{new Date(o.createdAt).toLocaleDateString()}</td></tr>)}
            </tbody></table></div></div>
          )}
        </div>
      )}

      {/* REPTRO FRESH ADMIN */}
      {activeTab === 'reptrofresh' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ fontWeight: 700 }}>🌱 Reptro Fresh Items ({freshItems.length})</h3>
            <button className="admin-btn admin-btn-primary" onClick={() => { resetFreshForm(); setEditingFresh(null); setShowFreshForm(true); }}>
              <FiPlus size={14} /> Add Fresh Item
            </button>
          </div>

          {showFreshForm && (
            <div className="admin-form" style={{ marginBottom: 24 }}>
              <h3>{editingFresh ? 'Edit' : 'Add'} Reptro Fresh Item</h3>
              <form onSubmit={handleFreshSubmit}>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Name *</label>
                    <input type="text" value={freshForm.name} onChange={e => setFreshForm({ ...freshForm, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Type *</label>
                    <select value={freshForm.type} onChange={e => setFreshForm({ ...freshForm, type: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
                      <option value="sprout">🌱 Sprout</option>
                      <option value="fruit">🍎 Fruit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Shop Owner</label>
                    <input type="text" value={freshForm.shopOwner} onChange={e => setFreshForm({ ...freshForm, shopOwner: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Bowl Size</label>
                    <input type="text" placeholder="e.g. 100g Bowl" value={freshForm.bowlSize} onChange={e => setFreshForm({ ...freshForm, bowlSize: e.target.value })} />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 16 }}>
                  <label>Description (Short)</label>
                  <input type="text" value={freshForm.description} onChange={e => setFreshForm({ ...freshForm, description: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Health Benefits</label>
                  <textarea value={freshForm.healthBenefits} onChange={e => setFreshForm({ ...freshForm, healthBenefits: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, minHeight: 60, fontFamily: 'inherit' }} />
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'fresh')} />
                  {freshForm.image && (
  <img 
    src={freshForm.image.startsWith('http') ? freshForm.image : 'http://localhost:5000' + freshForm.image} 
    alt="Preview" 
    className="image-preview" 
  />
)}
                </div>

                {/* PRICING SECTION */}
                <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', padding: 16, borderRadius: 12, marginBottom: 16, border: '2px solid #22c55e' }}>
                  <h4 style={{ color: '#065f46', marginBottom: 12, fontSize: 14 }}>💰 Single Bowl Pricing</h4>
                  <div className="admin-form-grid">
                    <div className="form-group">
                      <label>Price *</label>
                      <input type="number" value={freshForm.singleBowlPrice} onChange={e => setFreshForm({ ...freshForm, singleBowlPrice: e.target.value })} required placeholder="20" />
                    </div>
                    <div className="form-group">
                      <label>Original Price (MRP)</label>
                      <input type="number" value={freshForm.singleBowlOriginalPrice} onChange={e => setFreshForm({ ...freshForm, singleBowlOriginalPrice: e.target.value })} placeholder="25" />
                    </div>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', padding: 16, borderRadius: 12, marginBottom: 16, border: '2px solid #f59e0b' }}>
                  <h4 style={{ color: '#78350f', marginBottom: 12, fontSize: 14 }}>📅 Monthly Subscription Pricing</h4>
                  <div className="admin-form-grid">
                    <div className="form-group">
                      <label>Monthly Price *</label>
                      <input type="number" value={freshForm.monthlyPrice} onChange={e => setFreshForm({ ...freshForm, monthlyPrice: e.target.value })} required placeholder="450" />
                    </div>
                    <div className="form-group">
                      <label>Monthly Original Price</label>
                      <input type="number" value={freshForm.monthlyOriginalPrice} onChange={e => setFreshForm({ ...freshForm, monthlyOriginalPrice: e.target.value })} placeholder="600" />
                    </div>
                    <div className="form-group">
                      <label>Days in Plan</label>
                      <input type="number" value={freshForm.monthlyDays} onChange={e => setFreshForm({ ...freshForm, monthlyDays: e.target.value })} placeholder="30" />
                    </div>
                  </div>

                  {freshForm.singleBowlPrice && freshForm.monthlyPrice && freshForm.monthlyDays && (
                    <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginTop: 12, border: '1px solid #d97706' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#78350f', marginBottom: 6 }}>💡 Savings Calculator</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span>Daily price × {freshForm.monthlyDays} days:</span>
                        <span style={{ fontWeight: 700 }}>₹{calcSavings().daily}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span>Monthly plan price:</span>
                        <span style={{ fontWeight: 700 }}>₹{freshForm.monthlyPrice}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, paddingTop: 6, borderTop: '1px dashed #d97706', color: '#16a34a', fontWeight: 800 }}>
                        <span>✅ Customer Saves:</span>
                        <span>₹{calcSavings().save} ({calcSavings().percent}% off)</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Stock</label>
                    <input type="number" value={freshForm.stock} onChange={e => setFreshForm({ ...freshForm, stock: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={freshForm.isAvailable} onChange={e => setFreshForm({ ...freshForm, isAvailable: e.target.checked })} />
                    Available
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={freshForm.isFeatured} onChange={e => setFreshForm({ ...freshForm, isFeatured: e.target.checked })} />
                    Featured
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '12px 24px' }}>{editingFresh ? 'Update' : 'Create'}</button>
                  <button type="button" className="admin-btn" style={{ padding: '12px 24px', background: 'var(--bg-secondary)' }} onClick={() => { setShowFreshForm(false); setEditingFresh(null); }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="admin-table">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Single Bowl</th>
                    <th>Monthly</th>
                    <th>Save</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {freshItems.map(item => {
                    const dailyTotal = item.singleBowlPrice * item.monthlyDays;
                    const save = dailyTotal - item.monthlyPrice;
                    const percent = dailyTotal > 0 ? Math.round((save / dailyTotal) * 100) : 0;
                    return (
                      <tr key={item._id}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td>{item.type === 'sprout' ? '🌱 Sprout' : '🍎 Fruit'}</td>
                        <td>₹{item.singleBowlPrice}/{item.bowlSize}</td>
                        <td>₹{item.monthlyPrice}/{item.monthlyDays}d</td>
                        <td style={{ color: '#16a34a', fontWeight: 700 }}>₹{save} ({percent}%)</td>
                        <td>{item.stock}</td>
                        <td>
                          <span className={'status-badge ' + (item.isAvailable ? 'status-delivered' : 'status-cancelled')}>
                            {item.isAvailable ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleEditFresh(item)}><FiEdit size={12} /></button>
                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteFresh(item._id)}><FiTrash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ fontWeight: 700 }}>Products ({products.length})</h3>
            <button className="admin-btn admin-btn-primary" onClick={() => { resetForm(); setEditingProduct(null); setShowForm(true); }}><FiPlus size={14} /> Add Product</button>
          </div>
          {showForm && (
            <div className="admin-form" style={{ marginBottom: 24 }}>
              <h3>{editingProduct ? 'Edit' : 'Add'} Product</h3>
              <form onSubmit={handleProductSubmit}>
                <div className="admin-form-grid">
                  <div className="form-group"><label>Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  <div className="form-group"><label>Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}><option value="">Select</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                  <div className="form-group"><label>Shop Owner</label><input type="text" value={form.shopOwner} onChange={e => setForm({ ...form, shopOwner: e.target.value })} /></div>
                  <div className="form-group"><label>Tags (comma sep)</label><input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
                </div>
                <div className="form-group" style={{ marginTop: 16 }}><label>Description</label><input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <div className="form-group"><label>Image</label><input type="file" accept="image/*" onChange={e => handleImageUpload(e)} />{form.image && (
  <img 
    src={form.image.startsWith('http') ? form.image : 'http://localhost:5000' + form.image} 
    alt="Preview" 
    className="image-preview" 
  />
)}</div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                  {['isFeatured', 'isFlashSale'].map(f => <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="checkbox" checked={form[f]} onChange={e => setForm({ ...form, [f]: e.target.checked })} />{f.replace('is', '')}</label>)}
                </div>
                {form.isFlashSale && (
                  <div className="form-group"><label>Flash Sale Discount %</label><input type="number" value={form.flashSaleDiscount} onChange={e => setForm({ ...form, flashSaleDiscount: e.target.value })} /></div>
                )}

                <h4 style={{ marginBottom: 12 }}>Variants (Size/Price)</h4>
                {form.variants.map((v, i) => (
                  <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 12 }}>
                    <div className="variant-form-row">
                      <div className="form-group"><label>Size</label><input type="text" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} required /></div>
                      <div className="form-group"><label>Default Price</label><input type="number" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} required /></div>
                      <div className="form-group"><label>MRP</label><input type="number" value={v.originalPrice} onChange={e => updateVariant(i, 'originalPrice', e.target.value)} /></div>
                      <div className="form-group"><label>Stock</label><input type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} /></div>
                      {form.variants.length > 1 && <button type="button" className="variant-remove-btn" onClick={() => removeVariant(i)}><FiX size={14} /></button>}
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>📍 Location Based Prices (optional)</label>
                      {(v.locationPrices || []).map((lp, li) => (
                        <div key={li} style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                          <span style={{ fontSize: 12, minWidth: 80 }}>{lp.location}</span>
                          <input type="number" placeholder="Price" value={lp.price} onChange={e => updateLocationPrice(i, li, 'price', e.target.value)} style={{ width: 80, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12 }} />
                          <input type="number" placeholder="MRP" value={lp.originalPrice || ''} onChange={e => updateLocationPrice(i, li, 'originalPrice', e.target.value)} style={{ width: 80, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12 }} />
                          <button type="button" onClick={() => removeLocationPrice(i, li)} style={{ background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 10 }}>✕</button>
                        </div>
                      ))}
                      <div style={{ marginTop: 4 }}>
                        <select onChange={e => { if (e.target.value) { addLocationPrice(i, e.target.value); e.target.value = ''; } }} style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11 }}>
                          <option value="">+ Add Location Price</option>
                          {locations.filter(l => l.isActive && !(v.locationPrices || []).find(lp => lp.location === l.name)).map(l => (
                            <option key={l._id} value={l.name}>{l.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn-success" onClick={addVariant} style={{ marginBottom: 16 }}><FiPlus size={14} /> Add Variant</button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '12px 24px' }}>{editingProduct ? 'Update' : 'Create'}</button>
                  <button type="button" className="admin-btn" style={{ padding: '12px 24px', background: 'var(--bg-secondary)' }} onClick={() => { setShowForm(false); setEditingProduct(null); }}>Cancel</button>
                </div>
              </form>
            </div>
          )}
          <div className="admin-table"><div className="table-responsive"><table><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Shop</th><th>Flash</th><th>Orders</th><th>Actions</th></tr></thead><tbody>
            {products.map(p => <tr key={p._id}><td style={{ fontWeight: 600 }}>{p.name}</td><td>{p.category?.name}</td><td>₹{p.variants?.[0]?.price}</td><td>{p.shopOwner}</td><td>{p.isFlashSale ? '⚡' : '-'}</td><td>{p.orderCount}</td><td><div style={{ display: 'flex', gap: 4 }}><button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleEdit(p)}><FiEdit size={12} /></button><button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(p._id)}><FiTrash2 size={12} /></button></div></td></tr>)}
          </tbody></table></div></div>
        </div>
      )}

      {activeTab === 'orders' && (
  <div>
    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Orders ({orders.length})</h3>
    <div className="admin-table">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order#</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td style={{ fontWeight: 600 }}>{o.orderNumber || '-'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {o.user?.profilePic && (
                      <img src={o.user.profilePic} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{o.user?.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{o.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td>{o.phone}</td>
                <td>
                  <button
                    onClick={() => setSelectedOrderDetails(o)}
                    style={{
                      background: 'var(--primary)',
                      color: '#fff',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {o.totalItems} items 👁️
                  </button>
                </td>
                <td>₹{o.total}</td>
                <td>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: o.paymentMethod === 'upi' ? '#f5f3ff' : '#fef3c7',
                    color: o.paymentMethod === 'upi' ? '#5b21b6' : '#78350f'
                  }}>
                    {o.paymentMethod?.toUpperCase() || 'COD'}
                  </span>
                </td>
                <td><span className={'status-badge status-' + o.status}>{o.status}</span></td>
                <td>
                  <select
                    value={o.status}
                    onChange={e => handleOrderStatus(o._id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 11 }}
                  >
                    {['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* ORDER DETAILS MODAL */}
    {selectedOrderDetails && (
      <div className="modal-overlay" onClick={() => setSelectedOrderDetails(null)} style={{ zIndex: 3000 }}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 550 }}>
          <button className="modal-close" onClick={() => setSelectedOrderDetails(null)}><FiX /></button>
          <h2 className="modal-title">📦 Order Details</h2>
          <p className="modal-subtitle">#{selectedOrderDetails.orderNumber}</p>

          {/* Customer Info */}
          <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' }}>Customer</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {selectedOrderDetails.user?.profilePic && (
                <img src={selectedOrderDetails.user.profilePic} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{selectedOrderDetails.user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{selectedOrderDetails.user?.email}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>📞 {selectedOrderDetails.phone}</div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div style={{ background: '#fff7ed', padding: 12, borderRadius: 10, marginBottom: 12, border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', marginBottom: 4, textTransform: 'uppercase' }}>📍 Delivery Address</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedOrderDetails.deliveryAddress || selectedOrderDetails.location}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
              Type: <strong>{selectedOrderDetails.deliveryType === 'fast' ? '⚡ Fast (30 min)' : '🕐 Normal (By 7 PM)'}</strong>
            </div>
          </div>

          {/* Items List */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>🛒 Items ({selectedOrderDetails.totalItems})</div>
            {selectedOrderDetails.items?.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 10,
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 8,
                marginBottom: 6
              }}>
                <div style={{
                  width: 45, height: 45,
                  background: '#f8fafc',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  overflow: 'hidden'
                }}>
                  {item.image ? (
                    <img src={'http://localhost:5000' + item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : '📦'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {item.variant} • Qty: <strong>{item.quantity}</strong>
                  </div>
                  {item.shopOwner && (
                    <div style={{ fontSize: 10, color: 'var(--text-light)' }}>by {item.shopOwner}</div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>
                    ₹{item.price * item.quantity}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                    ₹{item.price} × {item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', padding: 12, borderRadius: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 700 }}>₹{selectedOrderDetails.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>Delivery Charge:</span>
              <span style={{ fontWeight: 700 }}>₹{selectedOrderDetails.deliveryCharge}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, paddingTop: 6, borderTop: '2px dashed #16a34a', marginTop: 4 }}>
              <span>Total:</span>
              <span style={{ color: '#16a34a' }}>₹{selectedOrderDetails.total}</span>
            </div>
            <div style={{ fontSize: 11, marginTop: 8, textAlign: 'center', color: 'var(--text-secondary)' }}>
              Payment: <strong>{selectedOrderDetails.paymentMethod === 'upi' ? '💳 UPI (Pay on delivery)' : '💰 Cash on Delivery'}</strong>
            </div>
          </div>

          {/* Tracking */}
          {selectedOrderDetails.tracking && selectedOrderDetails.tracking.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>📋 Order Timeline</div>
              {selectedOrderDetails.tracking.map((t, i) => (
                <div key={i} style={{ padding: 8, background: 'var(--bg-secondary)', borderRadius: 6, marginBottom: 4, fontSize: 11 }}>
                  <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{t.status.replace(/_/g, ' ')}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{t.message}</div>
                  <div style={{ color: 'var(--text-light)', fontSize: 10, marginTop: 2 }}>
                    {new Date(t.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
)}

      {activeTab === 'locations' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <input type="text" placeholder="New location name" value={newLocationName} onChange={e => setNewLocationName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddLocation()} style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, outline: 'none' }} />
            <button className="admin-btn admin-btn-primary" onClick={handleAddLocation}><FiPlus size={14} /> Add Location</button>
          </div>
          <div className="admin-table"><div className="table-responsive"><table><thead><tr><th>Location</th><th>Status</th><th>Default</th><th>Actions</th></tr></thead><tbody>
            {locations.map(l => <tr key={l._id}><td style={{ fontWeight: 600 }}>{l.name}</td><td><span className={'status-badge ' + (l.isActive ? 'status-delivered' : 'status-cancelled')}>{l.isActive ? 'Active' : 'Locked'}</span></td><td>{l.isDefault ? '✓ Default' : ''}</td><td style={{ display: 'flex', gap: 4 }}><button className={'admin-btn admin-btn-sm ' + (l.isActive ? 'admin-btn-danger' : 'admin-btn-success')} onClick={() => handleToggleLocation(l)}>{l.isActive ? 'Lock' : 'Unlock'}</button>{!l.isDefault && <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteLocation(l)}><FiTrash2 size={12} /></button>}</td></tr>)}
          </tbody></table></div></div>
        </div>
      )}
{activeTab === 'subscriptions' && (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
      <h3 style={{ fontWeight: 700 }}>🌱 Subscriptions ({subscriptions.length})</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="admin-btn admin-btn-success" onClick={handleBulkAttendance}>
          ✓ Mark Today Delivered
        </button>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowSubForm(true)}>
          <FiPlus size={14} /> Activate
        </button>
      </div>
    </div>

    {showSubForm && (
      <div className="admin-form" style={{ marginBottom: 24 }}>
        <h3>🌱 Activate Subscription</h3>
        <form onSubmit={handleCreateSubscription}>
          <div className="admin-form-grid">
            <div className="form-group">
              <label>Select User *</label>
              <select value={subForm.userId} onChange={e => setSubForm({...subForm, userId: e.target.value})} required style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
                <option value="">Choose User</option>
                {users.filter(u => u.role !== 'admin').map(u => (
                  <option key={u._id} value={u._id}>{u.name} - {u.phone}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Fresh Item *</label>
              <select value={subForm.freshItemId} onChange={e => setSubForm({...subForm, freshItemId: e.target.value})} required style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
                <option value="">Choose Item</option>
                {freshItemsAdmin.map(f => (
                  <option key={f._id} value={f._id}>{f.type === 'sprout' ? '🌱' : '🍎'} {f.name} - ₹{f.monthlyPrice}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Start Date *</label>
              <input type="date" value={subForm.startDate} onChange={e => setSubForm({...subForm, startDate: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Payment</label>
              <select value={subForm.paymentMethod} onChange={e => setSubForm({...subForm, paymentMethod: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
                <option value="cod">COD</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '12px 24px' }}>Activate</button>
            <button type="button" className="admin-btn" style={{ padding: '12px 24px', background: 'var(--bg-secondary)' }} onClick={() => setShowSubForm(false)}>Cancel</button>
          </div>
        </form>
      </div>
    )}

    <div className="admin-table">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Item</th>
              <th>Dates</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map(sub => (
              <tr key={sub._id}>
                <td>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{sub.user?.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{sub.user?.phone}</div>
                </td>
                <td style={{ fontSize: 12, fontWeight: 600 }}>
                  {sub.itemType === 'sprout' ? '🌱' : '🍎'} {sub.itemName}
                </td>
                <td style={{ fontSize: 10 }}>
                  {new Date(sub.startDate).toLocaleDateString('en-IN')}<br/>
                  to {new Date(sub.endDate).toLocaleDateString('en-IN')}
                </td>
                <td>
                  <div style={{ fontSize: 11 }}>{sub.deliveredCount}/{sub.totalDays}</div>
                  <div style={{ background: '#e5e7eb', height: 4, borderRadius: 2, minWidth: 60 }}>
                    <div style={{ background: '#22c55e', height: '100%', width: `${Math.round((sub.deliveredCount/sub.totalDays)*100)}%` }} />
                  </div>
                </td>
                <td>
                  <select value={sub.status} onChange={e => handleSubStatus(sub._id, e.target.value)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 11 }}>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => setSelectedSubForAttendance(sub)}>📅</button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteSubscription(sub._id)}><FiTrash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {selectedSubForAttendance && (
      <div className="modal-overlay" onClick={() => setSelectedSubForAttendance(null)} style={{ zIndex: 3000 }}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 700, maxHeight: '90vh', overflow: 'auto' }}>
          <button className="modal-close" onClick={() => setSelectedSubForAttendance(null)}><FiX /></button>
          <h2 className="modal-title">📅 {selectedSubForAttendance.itemName}</h2>
          <p className="modal-subtitle">{selectedSubForAttendance.user?.name}</p>

          <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
            Click any day to mark attendance:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {selectedSubForAttendance.attendance?.map((day, idx) => {
              const dayDate = new Date(day.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPast = dayDate < today;
              const isToday = dayDate.toDateString() === today.toDateString();
              const bg = day.status === 'delivered' ? '#22c55e' : day.status === 'skipped' ? '#f59e0b' : day.status === 'holiday' ? '#8b5cf6' : isToday ? '#3b82f6' : isPast ? '#ef4444' : '#f1f5f9';
              const color = day.status === 'pending' && !isToday && !isPast ? '#64748b' : '#fff';
              return (
                <div key={idx} style={{ background: bg, color: color, borderRadius: 8, padding: 8, textAlign: 'center', cursor: 'pointer', minHeight: 70, fontSize: 10, fontWeight: 700 }} onClick={() => {
                  const newStatus = prompt(`Day ${idx + 1}\nEnter:\n1 = delivered\n2 = skipped\n3 = holiday\n4 = pending`, '1');
                  if (newStatus) {
                    const map = { '1': 'delivered', '2': 'skipped', '3': 'holiday', '4': 'pending' };
                    if (map[newStatus]) handleMarkAttendance(selectedSubForAttendance._id, idx, map[newStatus]);
                  }
                }}>
                  <div>Day {idx + 1}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, marginTop: 2 }}>{dayDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                  {day.status === 'delivered' && <div>✓</div>}
                  {day.status === 'skipped' && <div>⏭</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}
  </div>
)}
     {activeTab === 'users' && (
  <div className="admin-table">
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Login</th>
            <th>Location</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>
                {u.profilePic ? (
                  <img src={u.profilePic} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
                )}
              </td>
              <td style={{ fontWeight: 600 }}>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: u.loginMethod === 'google' ? '#dbeafe' : '#fef3c7', color: u.loginMethod === 'google' ? '#1e40af' : '#78350f', fontWeight: 700 }}>
                  {u.loginMethod === 'google' ? '🔵 Google' : '📧 Email'}
                </span>
              </td>
              <td style={{ fontSize: 11 }}>{u.selectedLocation}</td>
              <td>
                <span className={'status-badge ' + (u.role === 'admin' ? 'status-confirmed' : 'status-pending')}>
                  {u.role}
                </span>
              </td>
              <td>
                <span className={'status-badge ' + (u.isActive ? 'status-delivered' : 'status-cancelled')}>
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                {u.role !== 'admin' && (
                  <button
                    className={'admin-btn admin-btn-sm ' + (u.isActive ? 'admin-btn-danger' : 'admin-btn-success')}
                    onClick={() => handleToggleUser(u._id)}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      {activeTab === 'categories' && (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
      <h3 style={{ fontWeight: 700 }}>📦 Categories ({categories.length})</h3>
      <button className="admin-btn admin-btn-primary" onClick={() => { resetCategoryForm(); setEditingCategory(null); setShowCategoryForm(true); }}>
        <FiPlus size={14} /> Add Category
      </button>
    </div>

    {showCategoryForm && (
      <div className="admin-form" style={{ marginBottom: 24 }}>
        <h3>{editingCategory ? 'Edit' : 'Add'} Category</h3>
        <form onSubmit={handleCategorySubmit}>
          <div className="admin-form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                placeholder="e.g. Frozen Foods"
                value={categoryForm.name}
                onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                required
              />
              <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>
                URL slug will be: {categoryForm.name ? categoryForm.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') : 'auto-generated'}
              </p>
            </div>
            <div className="form-group">
              <label>Icon (Emoji)</label>
              <input
                type="text"
                placeholder="🍕"
                value={categoryForm.icon}
                onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                maxLength={2}
              />
              <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>
                Copy emoji from: emojipedia.org
              </p>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label>Subtitle</label>
            <input
              type="text"
              placeholder="Fresh & delivered fast"
              value={categoryForm.subtitle}
              onChange={e => setCategoryForm({ ...categoryForm, subtitle: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={categoryForm.isActive}
                onChange={e => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
              />
              Active (visible to customers)
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '12px 24px' }}>
              {editingCategory ? 'Update Category' : 'Create Category'}
            </button>
            <button
              type="button"
              className="admin-btn"
              style={{ padding: '12px 24px', background: 'var(--bg-secondary)' }}
              onClick={() => { setShowCategoryForm(false); setEditingCategory(null); }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}

    <div className="admin-table">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Subtitle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id}>
                <td style={{ fontSize: 24 }}>{c.icon}</td>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{c.slug}</td>
                <td style={{ fontSize: 12 }}>{c.subtitle}</td>
                <td>
                  <span className={'status-badge ' + (c.isActive ? 'status-delivered' : 'status-cancelled')}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <button
                      className={'admin-btn admin-btn-sm ' + (c.isActive ? 'admin-btn-danger' : 'admin-btn-success')}
                      onClick={() => handleToggleCategory(c._id)}
                      title={c.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {c.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      onClick={() => handleEditCategory(c)}
                    >
                      <FiEdit size={12} />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleDeleteCategory(c._id, c.name)}
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminPanel;