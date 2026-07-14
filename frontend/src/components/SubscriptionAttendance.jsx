import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { subscriptionAPI } from '../utils/api';
import { getImageURL } from '../utils/helpers';

const SubscriptionAttendance = ({ subscription, onClose }) => {
  const [sub, setSub] = useState(subscription);
  
  useEffect(() => {
    if (subscription?._id) {
      subscriptionAPI.getMySubscription(subscription._id)
        .then(r => setSub(r.data))
        .catch(console.error);
    }
  }, [subscription._id]);

  if (!sub) return null;

  const startDate = new Date(sub.startDate);
  const endDate = new Date(sub.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = sub.totalDays || 28;
  const delivered = sub.deliveredCount || 0;
  const skipped = sub.skippedCount || 0;
  const remaining = totalDays - delivered - skipped;
  const progressPercent = Math.round((delivered / totalDays) * 100);

  const weeks = [];
  for (let i = 0; i < sub.attendance.length; i += 7) {
    weeks.push(sub.attendance.slice(i, i + 7));
  }

  const getStatusColor = (status, date) => {
    const attDate = new Date(date);
    attDate.setHours(0, 0, 0, 0);
    const isPast = attDate < today;
    const isToday = attDate.getTime() === today.getTime();
    if (status === 'delivered') return { bg: '#22c55e', text: '#fff', icon: '✓' };
    if (status === 'skipped') return { bg: '#f59e0b', text: '#fff', icon: '⏭' };
    if (status === 'holiday') return { bg: '#8b5cf6', text: '#fff', icon: '🏖' };
    if (isToday) return { bg: '#3b82f6', text: '#fff', icon: '📍' };
    if (isPast) return { bg: '#ef4444', text: '#fff', icon: '✗' };
    return { bg: '#f1f5f9', text: '#64748b', icon: '' };
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <button className="modal-close" onClick={onClose}><FiX /></button>

        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', margin: '-32px -24px 20px', padding: '24px', borderRadius: '20px 20px 0 0', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            {sub.freshItem?.image ? (
              <img src={getImageURL(sub.freshItem.image)} alt={sub.itemName} style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }} />
            ) : (
              <div style={{ width: 60, height: 60, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                {sub.itemType === 'sprout' ? '🌱' : '🍎'}
              </div>
            )}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{sub.itemName}</h2>
              <p style={{ fontSize: 12, opacity: 0.95 }}>📅 Monthly Subscription • {sub.bowlSize}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ background: '#fff', color: '#059669', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
              ✓ {sub.status.toUpperCase()}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
              💰 ₹{sub.monthlyPrice}
            </span>
            {sub.totalSavings > 0 && (
              <span style={{ background: '#fbbf24', color: '#78350f', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
                💚 Saved ₹{sub.totalSavings}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '10px 12px', borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: '#065f46', fontWeight: 700 }}>📅 START DATE</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#065f46', marginTop: 2 }}>
              {startDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 12px', borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: '#991b1b', fontWeight: 700 }}>📅 END DATE</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#991b1b', marginTop: 2 }}>
              {endDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #93c5fd', padding: 14, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e40af' }}>
              <FiTrendingUp style={{ display: 'inline', marginRight: 4 }} size={12} />
              Progress: {delivered}/{totalDays} days
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1e40af' }}>{progressPercent}%</div>
          </div>
          <div style={{ background: '#fff', height: 10, borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(90deg, #22c55e, #16a34a)', height: '100%', width: progressPercent + '%', borderRadius: 5 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#16a34a' }}>{delivered}</div>
              <div style={{ fontSize: 9, fontWeight: 700 }}>DELIVERED</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{skipped}</div>
              <div style={{ fontSize: 9, fontWeight: 700 }}>SKIPPED</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>{remaining}</div>
              <div style={{ fontSize: 9, fontWeight: 700 }}>REMAINING</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiCalendar size={14} /> Attendance Sheet
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {dayNames.map((day, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', padding: '4px 0' }}>{day}</div>
            ))}
          </div>
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
              {week.map((day, dayIdx) => {
                const dayNum = weekIdx * 7 + dayIdx + 1;
                const style = getStatusColor(day.status, day.date);
                return (
                  <div key={dayIdx} style={{ background: style.bg, color: style.text, borderRadius: 8, padding: 6, textAlign: 'center', minHeight: 55, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.9, marginBottom: 2 }}>Day {dayNum}</div>
                    <div style={{ fontSize: 11, fontWeight: 800 }}>{formatDate(day.date)}</div>
                    {style.icon && <div style={{ fontSize: 14, marginTop: 2 }}>{style.icon}</div>}
                  </div>
                );
              })}
              {week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
                <div key={'empty-' + i} style={{ minHeight: 55 }}></div>
              ))}
            </div>
          ))}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--border)', justifyContent: 'center' }}>
            <LegendItem color="#22c55e" text="Delivered" icon="✓" />
            <LegendItem color="#3b82f6" text="Today" icon="📍" />
            <LegendItem color="#f59e0b" text="Skipped" icon="⏭" />
            <LegendItem color="#ef4444" text="Missed" icon="✗" />
            <LegendItem color="#f1f5f9" text="Pending" textColor="#64748b" />
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center' }}>
          📍 <strong>{sub.deliveryAddress}</strong> • 📞 {sub.phone} • 🕐 Delivered at 7 AM
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, text, icon, textColor }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
    <div style={{ width: 12, height: 12, borderRadius: 3, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: textColor || '#fff', fontWeight: 800 }}>{icon || ''}</div>
    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{text}</span>
  </div>
);

export default SubscriptionAttendance;