import React, { useState, useEffect } from 'react';
import { FiClock, FiTruck, FiHeart, FiCheckCircle } from 'react-icons/fi';
import { reptroFreshAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { getWhatsAppURL, getImageURL } from '../utils/helpers';

const ReptroFresh = () => {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();
  useEffect(() => {
    reptroFreshAPI.getAll().then(r => setItems(r.data)).catch(console.error);
  }, []);
  if (items.length === 0) return null;

  return (
    <div className="rf-premium-section">
      <div className="rf-premium-badge-top">
        <span className="rf-premium-dot">●</span> PREMIUM · REPTRO FRESH
      </div>

      <div className="rf-premium-header">
        <h2 className="rf-premium-title">Fresh Bowls, <span style={{ color: '#22c55e' }}>Delivered Daily</span></h2>
        <p className="rf-premium-subtitle">
          Healthy sprouts & seasonal fruits — handpicked, hygienically packed, delivered fresh every morning at 7 AM 🌅
        </p>
      </div>

      <div className="rf-premium-tags">
        <span className="rf-premium-tag"><FiCheckCircle size={11} /> 100% Organic</span>
        <span className="rf-premium-tag"><FiTruck size={11} /> Free Delivery</span>
        <span className="rf-premium-tag"><FiClock size={11} /> 7 AM Daily</span>
        <span className="rf-premium-tag rf-tag-premium"><FiHeart size={11} /> Premium Quality</span>
      </div>

      <div className="rf-premium-scroll">
        {items.map(item => {
          const dailyTotal = item.singleBowlPrice * item.monthlyDays;
          const savings = dailyTotal - item.monthlyPrice;
          const savingsPercent = Math.round((savings / dailyTotal) * 100);

          return (
            <div key={item._id} className="rf-premium-card">
              <div className="rf-premium-image-wrapper">
                <div className="rf-type-badge">
                  <span>{item.type === 'sprout' ? 'Sprout' : 'Fruit'}</span>
                </div>
                {item.image ? (
                  <img src={getImageURL(item.image)} alt={item.name} className="rf-premium-image" />
                ) : (
                  <div className="rf-premium-image-fallback">
                    <span>{item.type === 'sprout' ? '🌱' : '🍎'}</span>
                  </div>
                )}
              </div>

              <div className="rf-premium-content">
                <h3 className="rf-premium-name">{item.name}</h3>

                {/* Health Benefits Instead of ingredient tags */}
                {item.healthBenefits && (
                  <p className="rf-health-text">
                    💚 {item.healthBenefits}
                  </p>
                )}

                <div className="rf-nutrition">
                  <div className="rf-nutri-item">
                    <span className="rf-nutri-icon">⚖️</span>
                    <span>{item.bowlSize || '100g'}</span>
                  </div>
                  <div className="rf-nutri-item">
                    <span className="rf-nutri-icon">🔥</span>
                    <span>{item.type === 'sprout' ? '110 kcal' : '90 kcal'}</span>
                  </div>
                  <div className="rf-nutri-item">
                    <span className="rf-nutri-icon">🛡️</span>
                    <span>Fresh</span>
                  </div>
                </div>

                <div className="rf-pricing-grid">
                  <div className="rf-price-box rf-price-single">
                    <div className="rf-price-label">1 BOWL</div>
                    <div className="rf-price-value">₹{item.singleBowlPrice}</div>
                  </div>
                  <div className="rf-price-box rf-price-monthly">
                    {savings > 0 && (
                      <div className="rf-save-tag-top">Save ₹{savings}</div>
                    )}
                    <div className="rf-price-label">MONTHLY</div>
                    <div className="rf-price-value-green">₹{item.monthlyPrice}</div>
                    <div className="rf-price-sub">{item.monthlyDays} bowls</div>
                  </div>
                </div>

                <div className="rf-action-buttons">
                  <button className="rf-btn-add" onClick={() => addToCart({
                    _id: item._id,
                    name: item.name,
                    image: item.image,
                    shopOwner: item.shopOwner,
                    variants: [{ size: item.bowlSize, price: item.singleBowlPrice }]
                  }, { size: item.bowlSize, price: item.singleBowlPrice })}>
                    + Add ₹{item.singleBowlPrice}
                  </button>
                  <button className="rf-btn-subscribe" onClick={() => {
                    const msg = '🌱 *Monthly Subscription Request*\n\nHi Reptro! I want to subscribe for *Monthly Plan*:\n\n📦 Product: ' + item.name + '\n📏 Size: ' + item.bowlSize + '\n💰 Single Bowl: ₹' + item.singleBowlPrice + '\n📅 Monthly Plan: ₹' + item.monthlyPrice + ' (' + item.monthlyDays + ' days)\n💚 You Save: ₹' + savings + ' (' + savingsPercent + '% off)\n\nPlease confirm my monthly subscription.';
                    window.open(getWhatsAppURL(msg), '_blank');
                  }}>
                    ⭐ Subscribe
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReptroFresh;