import React, { useState, useEffect } from 'react';
import { productAPI } from '../utils/api';
import ProductCard from './ProductCard';

const PopularPicks = ({ onProductClick }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchPopular();
  }, []);

  const fetchPopular = async () => {
    try {
      const { data } = await productAPI.getPopular();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching popular:', error);
    }
  };

  if (products.length === 0) return null;

  return (
    <div>
      <div className="section-header">
        <div className="section-title-group">
          <span className="section-icon">🔥</span>
          <div>
            <h2 className="section-title">Popular Picks</h2>
            <p className="section-subtitle">Most ordered by students</p>
          </div>
        </div>
        <button className="see-all-btn">See All →</button>
      </div>
      <div className="products-scroll-container">
        <div className="products-scroll">
          {products.map(product => (
            <ProductCard key={product._id} product={product} onClick={() => onProductClick(product)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularPicks;