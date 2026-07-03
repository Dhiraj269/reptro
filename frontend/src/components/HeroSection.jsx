import React from 'react';
import { FiSearch, FiShoppingBag, FiPhone } from 'react-icons/fi';
import { getWhatsAppURL } from '../utils/helpers';

const HeroSection = ({ onSearchClick, onShopClick }) => {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        🚀 #1 Campus Delivery
      </div>
      <h2 className="hero-title">
        Everything You Need,<br />
        Delivered <span className="highlight">to You.</span>
      </h2>
      <p className="hero-subtitle">
        Fresh groceries, snacks, medicines & more — at your hostel in just 10 minutes!
      </p>
      <div className="hero-tags">
        <span className="hero-tag">⏱️ 10 Min Delivery</span>
        <span className="hero-tag">🏷️ Student Prices</span>
        <span className="hero-tag">📦 1000+ Products</span>
      </div>
      <div className="hero-buttons">
        <button className="hero-btn hero-btn-primary" onClick={onSearchClick}>
          <FiSearch size={16} /> Search Products
        </button>
        <button className="hero-btn hero-btn-secondary" onClick={onShopClick}>
          <FiShoppingBag size={16} /> Shop Now
        </button>
      </div>
      <div className="hero-phone">
        <FiPhone className="hero-phone-icon" size={18} />
        <span className="hero-phone-text">Order on Phone:</span>
        <a href={getWhatsAppURL()} target="_blank" rel="noopener noreferrer" className="hero-phone-number" style={{textDecoration:'none', color:'var(--primary)'}}>
          +91 92791 67527
        </a>
      </div>
    </section>
  );
};

export default HeroSection;