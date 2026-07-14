import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiPackage, FiLogOut, FiSettings, FiShield, FiEdit, FiSave, FiMapPin, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI, authAPI, subscriptionAPI } from '../utils/api';
import OrderTracking from './OrderTracking';
import SubscriptionAttendance from './SubscriptionAttendance';
import toast from 'react-hot-toast';

const UserDashboard = ({ onClose }) => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [activeSection, setActiveSection] = useState('menu');
  const [showTracking, setShowTracking] = useState(false);
  const [trackOrderNum, setTrackOrderNum] = useState('');
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', password: '' });
  const [settings, setSettings] = useState({ notifications: true, darkMode: false });

  useEffect(() => {
    if (user) {
      orderAPI.getMyOrders().then(r => setOrders(r.data)).catch(console.error);
      subscriptionAPI.getMySubscriptions()
        .then(r => setSubscriptions(r.data.filter(s => s.status === 'active')))
        .catch(console.error);
      setProfileForm({ name: user.name || '', phone: user.phone || '', password: '' });
      setSettings({ notifications: user.notifications !== false, darkMode: user.darkMode || false });
    }
  }, [user]);

  const handleLogout = () => { 
    logout(); 
    toast.success('Logged out!'); 
    onClose(); 
  };

  const handleProfileSave = async () => {
    try {
      const updateData = { name: profileForm.name, phone: profileForm.phone };
      if (profileForm.password && profileForm.password.length >= 6) {
        updateData.password = profileForm.password;
      }
      const { data } = await authAPI.updateProfile(updateData);
      updateUser(data);
      toast.success('Profile updated!');
      setActiveSection('menu');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed!');
    }
  };

  const handleSettingsSave = async () => {
    try {
      const { data } = await authAPI.updateProfile({
        notifications: settings.notifications,
        darkMode: settings.darkMode
      });
      updateUser(data);
      toast.success('Settings saved!');
      setActiveSection('menu');
    } catch (error) {
      toast.error('Save failed!');
    }
  };

  const openTracking = (orderNum = '') => {
    setTrackOrderNum(orderNum);
    setShowTracking(true);
  };

  const closeTracking = () => {
    setShowTracking(false);
    setTrackOrderNum('');
  };

  if (!user) return null;

  // If tracking modal is open, show only that
  if (showTracking) {
    return <OrderTracking onClose={closeTracking} prefilledOrderNumber={trackOrderNum} />;
  }

  // If subscription attendance is open, show only that
  if (selectedSubscription) {
    return (
      <SubscriptionAttendance 
        subscription={selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
      />
    );
  }

  return (
    <>
      <div className="dashboard-overlay" onClick={onClose} />
      <div className="dashboard-drawer">
        <div className="dashboard-header" style={{ position: 'relative' }}>
          <button className="dashboard-close" onClick={onClose}><FiX /></button>
          <div className="dashboard-user-info">
            <h3>👋 Hey, {user.name}!</h3>
            <p>{user.email}</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <FiMapPin size={12} /> {user.deliveryAddress || user.selectedLocation || 'GEC Arwal'}
            </p>
          </div>
        </div>

        <div className="dashboard-menu">
          {activeSection === 'menu' && (
            <>
              <button className="dashboard-menu-item" onClick={() => setActiveSection('orders')}>
                <FiPackage className="icon" /> My Orders ({orders.length})
              </button>
              
              <button className="dashboard-menu-item" onClick={() => openTracking('')}>
                <FiMapPin className="icon" /> Track Order
              </button>

              {/* SUBSCRIPTIONS BUTTON - Only show if user has active subscriptions */}
              {subscriptions.length > 0 && (
                <button 
                  className="dashboard-menu-item" 
                  onClick={() => setActiveSection('subscriptions')}
                  style={{ 
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    border: '1px solid #86efac'
                  }}
                >
                  <span className="icon">🌱</span> 
                  My Subscriptions ({subscriptions.length})
                  <span style={{
                    marginLeft: 'auto',
                    background: '#22c55e',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 10
                  }}>
                    ACTIVE
                  </span>
                </button>
              )}
              
              <button className="dashboard-menu-item" onClick={() => setActiveSection('profile')}>
                <FiEdit className="icon" /> Edit Profile
              </button>
              
              <button className="dashboard-menu-item" onClick={() => setActiveSection('settings')}>
                <FiSettings className="icon" /> Settings
              </button>
              
              {user.role === 'admin' && (
                <button className="dashboard-menu-item" onClick={() => { navigate('/admin'); onClose(); }}>
                  <FiShield className="icon" /> Admin Panel
                </button>
              )}
              
              <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />
              
              <button className="dashboard-menu-item danger" onClick={handleLogout}>
                <FiLogOut className="icon" /> Logout
              </button>
            </>
          )}

          {/* MY ORDERS SECTION */}
          {activeSection === 'orders' && (
            <>
              <button 
                className="dashboard-menu-item" 
                onClick={() => setActiveSection('menu')} 
                style={{ color: 'var(--accent)', fontWeight: 700 }}
              >
                ← Back to Menu
              </button>
              <h4 style={{ padding: '8px 16px', fontWeight: 700 }}>My Orders</h4>
              {orders.length === 0 ? (
                <p style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: 13 }}>
                  No orders yet!
                </p>
              ) : orders.map(o => (
                <div key={o._id} style={{ 
                  padding: '12px', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: 'var(--radius)', 
                  marginBottom: 8, 
                  fontSize: 12, 
                  marginLeft: 16, 
                  marginRight: 16 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 11 }}>#{o.orderNumber}</span>
                    <span className={'status-badge status-' + o.status}>{o.status}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
                    {o.totalItems} items • ₹{o.total}
                  </div>
                  <div style={{ color: 'var(--text-light)', marginBottom: 8, fontSize: 11 }}>
                    📍 {o.deliveryAddress || o.location}
                  </div>
                  <div style={{ color: 'var(--text-light)', marginBottom: 8, fontSize: 10 }}>
                    {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <button
                    onClick={() => openTracking(o.orderNumber)}
                    style={{
                      width: '100%', padding: '8px 10px',
                      background: 'var(--accent)', color: '#fff',
                      border: 'none', borderRadius: 6, fontSize: 11,
                      fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                    }}
                  >
                    <FiSearch size={11} /> Track This Order
                  </button>
                </div>
              ))}
            </>
          )}

          {/* MY SUBSCRIPTIONS SECTION - NEW */}
          {activeSection === 'subscriptions' && (
            <>
              <button 
                className="dashboard-menu-item" 
                onClick={() => setActiveSection('menu')} 
                style={{ color: 'var(--accent)', fontWeight: 700 }}
              >
                ← Back to Menu
              </button>
              <h4 style={{ padding: '8px 16px', fontWeight: 700 }}>🌱 My Subscriptions</h4>
              {subscriptions.length === 0 ? (
                <p style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: 13 }}>
                  No active subscriptions
                </p>
              ) : subscriptions.map(sub => {
                const daysLeft = Math.ceil((new Date(sub.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                const progressPercent = Math.round((sub.deliveredCount / sub.totalDays) * 100);
                
                return (
                  <div 
                    key={sub._id} 
                    onClick={() => setSelectedSubscription(sub)}
                    style={{ 
                      padding: '14px', 
                      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                      border: '1px solid #86efac',
                      borderRadius: 12, 
                      marginBottom: 10, 
                      marginLeft: 16, 
                      marginRight: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 24 }}>{sub.itemType === 'sprout' ? '🌱' : '🍎'}</span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 13, color: '#065f46' }}>{sub.itemName}</div>
                          <div style={{ fontSize: 10, color: '#047857' }}>{sub.bowlSize}</div>
                        </div>
                      </div>
                      <span style={{ 
                        background: '#22c55e', 
                        color: '#fff', 
                        fontSize: 9, 
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 10,
                        textTransform: 'uppercase'
                      }}>
                        Active
                      </span>
                    </div>
                    
                    <div style={{ 
                      background: '#fff', 
                      borderRadius: 6, 
                      padding: 8, 
                      marginBottom: 8 
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: 10, 
                        color: '#065f46', 
                        fontWeight: 700,
                        marginBottom: 4 
                      }}>
                        <span>Progress: {sub.deliveredCount}/{sub.totalDays} days</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div style={{ 
                        background: '#e5e7eb', 
                        height: 6, 
                        borderRadius: 3, 
                        overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          background: 'linear-gradient(90deg, #22c55e, #16a34a)', 
                          height: '100%', 
                          width: progressPercent + '%',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#047857' }}>
                      <span>📅 {new Date(sub.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(sub.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      <span style={{ fontWeight: 800 }}>{daysLeft > 0 ? daysLeft + ' days left' : 'Expired'}</span>
                    </div>
                    
                    <div style={{ 
                      textAlign: 'center', 
                      fontSize: 10, 
                      color: '#0369a1', 
                      fontWeight: 700, 
                      marginTop: 8,
                      padding: 6,
                      background: '#eff6ff',
                      borderRadius: 6
                    }}>
                      👆 Tap to view attendance sheet
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* EDIT PROFILE SECTION */}
          {activeSection === 'profile' && (
            <>
              <button 
                className="dashboard-menu-item" 
                onClick={() => setActiveSection('menu')} 
                style={{ color: 'var(--accent)', fontWeight: 700 }}
              >
                ← Back to Menu
              </button>
              <div style={{ padding: '0 16px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Edit Profile</h4>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email (cannot change)</label>
                  <input type="email" value={user.email} disabled style={{ opacity: 0.5 }} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>New Password (optional, min 6 chars)</label>
                  <input type="password" placeholder="Leave blank to keep current" value={profileForm.password} onChange={e => setProfileForm({ ...profileForm, password: e.target.value })} />
                </div>
                <button 
                  onClick={handleProfileSave} 
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    background: 'var(--accent)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 'var(--radius)', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 8 
                  }}
                >
                  <FiSave size={16} /> Save Changes
                </button>
              </div>
            </>
          )}

          {/* SETTINGS SECTION */}
          {activeSection === 'settings' && (
            <>
              <button 
                className="dashboard-menu-item" 
                onClick={() => setActiveSection('menu')} 
                style={{ color: 'var(--accent)', fontWeight: 700 }}
              >
                ← Back to Menu
              </button>
              <div style={{ padding: '0 16px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Settings</h4>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 0', 
                  borderBottom: '1px solid var(--border)' 
                }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>🔔 Notifications</span>
                  <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={settings.notifications} 
                      onChange={e => setSettings({ ...settings, notifications: e.target.checked })} 
                      style={{ opacity: 0, width: 0, height: 0 }} 
                    />
                    <span style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      background: settings.notifications ? 'var(--success)' : '#ccc', 
                      borderRadius: 24, 
                      transition: '0.3s' 
                    }}>
                      <span style={{ 
                        position: 'absolute', 
                        width: 20, 
                        height: 20, 
                        background: '#fff', 
                        borderRadius: '50%', 
                        top: 2, 
                        left: settings.notifications ? 22 : 2, 
                        transition: '0.3s' 
                      }} />
                    </span>
                  </label>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 0', 
                  borderBottom: '1px solid var(--border)' 
                }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>🌙 Dark Mode</span>
                  <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={settings.darkMode} 
                      onChange={e => setSettings({ ...settings, darkMode: e.target.checked })} 
                      style={{ opacity: 0, width: 0, height: 0 }} 
                    />
                    <span style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      background: settings.darkMode ? 'var(--primary)' : '#ccc', 
                      borderRadius: 24, 
                      transition: '0.3s' 
                    }}>
                      <span style={{ 
                        position: 'absolute', 
                        width: 20, 
                        height: 20, 
                        background: '#fff', 
                        borderRadius: '50%', 
                        top: 2, 
                        left: settings.darkMode ? 22 : 2, 
                        transition: '0.3s' 
                      }} />
                    </span>
                  </label>
                </div>
                <div style={{ padding: '12px 0' }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>📍 Delivery Address</span>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {user.deliveryAddress || user.selectedLocation || 'GEC Arwal'}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-light)' }}>
                    Change location from main page to update delivery address
                  </p>
                </div>
                <button 
                  onClick={handleSettingsSave} 
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    background: 'var(--accent)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 'var(--radius)', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    marginTop: 12 
                  }}
                >
                  Save Settings
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;