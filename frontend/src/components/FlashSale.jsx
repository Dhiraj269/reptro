import React, { useState, useEffect } from 'react';
import { productAPI } from '../utils/api';
import ProductCard from './ProductCard';

const FlashSale = ({ onProductClick }) => {
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    productAPI.getFlashSale().then(r => setProducts(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = end - now;
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="fs-section">
      <div className="fs-header">
        <div className="fs-title-group">
          <span className="fs-icon">⚡</span>
          <h2 className="fs-title">Flash Sale</h2>
          <span className="fs-tag">LIVE</span>
        </div>
        <div className="fs-timer">
          <span className="fs-time">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="fs-colon">:</span>
          <span className="fs-time">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="fs-colon">:</span>
          <span className="fs-time">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>
      <div className="fs-products">
        {products.map(p => <ProductCard key={p._id} product={p} onClick={() => onProductClick(p)} />)}
      </div>
    </div>
  );
};

export default FlashSale;