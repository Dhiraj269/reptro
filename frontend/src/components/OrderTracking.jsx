import React, { useState, useEffect } from 'react';
import { FiX, FiSearch, FiPackage, FiCheck, FiTruck, FiClock, FiArrowLeft } from 'react-icons/fi';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const statusIcons = {
  pending: <FiClock size={18} />,
  confirmed: <FiCheck size={18} />,
  preparing: <FiPackage size={18} />,
  out_for_delivery: <FiTruck size={18} />,
  delivered: <FiCheck size={18} />,
  cancelled: <FiX size={18} />
};

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#8b5cf6',
  out_for_delivery: '#ec4899',
  delivered: '#22c55e',
  cancelled: '#ef4444'
};

const OrderTracking = ({ onClose, prefilledOrderNumber }) => {
  const [orderNumber, setOrderNumber] = useState(prefilledOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefilledOrderNumber) {
      handleTrack(prefilledOrderNumber);
    }
  }, [prefilledOrderNumber]);

  const handleTrack = async (orderNum) => {
    const num = orderNum || orderNumber;
    if (!num.trim()) { toast.error('Enter order number!'); return; }
    setLoading(true);
    try {
      const { data } = await orderAPI.trackOrder(num.trim());
      setOrder(data);
    } catch (error) {
      toast.error('Order not found!');
      setOrder(null);
    }
    setLoading(false);
  };

  return (
    <div className="track-fullscreen-overlay">
      <div className="track-fullscreen-content">
        <div className="track-header">
          <button onClick={onClose} className="track-back-btn">
            <FiArrowLeft size={20} />
          </button>
          <h2 className="track-page-title">📦 Track Your Order</h2>
        </div>

        <div className="track-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input
              type="text"
              placeholder="e.g. RPT12345678"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              style={{ flex: 1, padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, outline: 'none' }}
            />
            <button onClick={() => handleTrack()} disabled={loading} style={{ padding: '12px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiSearch size={18} />
            </button>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: 20 }}>Loading...</div>}

          {order && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', padding: 16, borderRadius: 'var(--radius)', marginBottom: 16, border: '1px solid #bae6fd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>#{order.orderNumber}</span>
                  <span className={'status-badge status-' + order.status}>{order.status}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {order.totalItems} items • ₹{order.total} • {order.deliveryType} delivery
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>
                  📍 {order.deliveryAddress || order.location}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>
                  📅 {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 700 }}>📋 Tracking Timeline</h4>
              <div style={{ position: 'relative', paddingLeft: 30, marginBottom: 20 }}>
                {order.tracking && order.tracking.map((t, i) => (
                  <div key={i} style={{ marginBottom: 16, position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: -30, top: 0,
                      width: 24, height: 24, borderRadius: '50%',
                      background: statusColors[t.status] || '#ccc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 12,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {statusIcons[t.status] || '•'}
                    </div>
                    {i < order.tracking.length - 1 && (
                      <div style={{
                        position: 'absolute', left: -19, top: 24, width: 2,
                        height: 'calc(100% - 8px)', background: '#e2e8f0'
                      }} />
                    )}
                    <div style={{ background: '#fff', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, textTransform: 'capitalize' }}>{t.status.replace(/_/g, ' ')}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.message}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>
                        {new Date(t.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>🛒 Items</h4>
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
                {order.items && order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--bg-secondary)' : 'none', fontSize: 13 }}>
                    <span>{item.name} ({item.variant}) x{item.quantity}</span>
                    <span style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;