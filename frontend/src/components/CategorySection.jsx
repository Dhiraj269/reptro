import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI, productAPI } from '../utils/api';
import ProductCard from './ProductCard';

const CategorySection = ({ onProductClick }) => {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await categoryAPI.getAll();
      setCategories(data);
      
      // Fetch products for each category
      for (const cat of data) {
        try {
          const prodRes = await productAPI.getAll({ category: cat._id });
          setCategoryProducts(prev => ({ ...prev, [cat._id]: prodRes.data.slice(0, 8) }));
        } catch (err) {
          console.error('Error fetching category products:', err);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div>
      {/* Category Icons Row */}
      <div className="section-header">
        <div className="section-title-group">
          <span className="section-icon">🛍️</span>
          <div>
            <h2 className="section-title">Shop by Category</h2>
          </div>
        </div>
      </div>
      <div className="categories-scroll-container">
        <div className="categories-scroll">
          {categories.map(cat => (
            <div
              key={cat._id}
              className="category-card"
              onClick={() => navigate(`/category/${cat.slug}`)}
            >
              <div className="category-icon-box">
                {cat.icon || '📦'}
              </div>
              <span className="category-card-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products by Category */}
      {categories.map(cat => {
        const products = categoryProducts[cat._id] || [];
        if (products.length === 0) return null;

        return (
          <div key={cat._id}>
            <div className="section-header">
              <div className="section-title-group">
                <span className="section-icon">{cat.icon || '📦'}</span>
                <div>
                  <h2 className="section-title">{cat.name}</h2>
                  <p className="section-subtitle">{cat.subtitle}</p>
                </div>
              </div>
              <button 
                className="see-all-btn"
                onClick={() => navigate(`/category/${cat.slug}`)}
              >
                See All →
              </button>
            </div>
            <div className="products-scroll-container">
              <div className="products-scroll">
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => onProductClick(product)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategorySection;