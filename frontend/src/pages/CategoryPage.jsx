import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import LocationSelector from '../components/LocationSelector';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Cart from '../components/Cart';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { categoryAPI, productAPI } from '../utils/api';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    categoryAPI.getAll().then(async (res) => {
      const cat = res.data.find(c => c.slug === slug);
      if (cat) { 
        setCategory(cat); 
        const p = await productAPI.getAll({ category: cat._id }); 
        setProducts(p.data); 
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  return (
    <div>
      {category && (
        <SEO 
          title={`${category.name} - Order Online at GEC Arwal | Reptro`}
          description={`Order ${category.name.toLowerCase()} online at GEC Arwal. ${products.length}+ products available. Fast delivery in 10 minutes, student prices, cash on delivery.`}
          keywords={`${category.name.toLowerCase()}, ${category.slug}, buy ${category.name.toLowerCase()} online, arwal ${category.name.toLowerCase()}, GEC Arwal ${category.name.toLowerCase()}, campus delivery`}
          url={`https://reptro.in/category/${slug}`}
        />
      )}
      <Navbar onSearchClick={() => {}} />
      <LocationSelector />
      <div className="category-page">
        <div className="category-page-header">
          <button className="back-btn" onClick={() => navigate('/')}><FiArrowLeft /></button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Poppins',sans-serif" }}>
              {category?.icon} {category?.name || 'Category'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {category?.subtitle} • {products.length} products
            </p>
          </div>
        </div>
        {loading ? <div className="loading-spinner"><div className="spinner" /></div> : (
          <div className="category-products-grid">
            {products.map(p => <ProductCard key={p._id} product={p} onClick={() => setSelectedProduct(p)} />)}
          </div>
        )}
        {!loading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <span style={{ fontSize: 48 }}>📦</span>
            <h3 style={{ marginTop: 12, color: 'var(--text-secondary)' }}>No products yet</h3>
          </div>
        )}
      </div>
      <Footer />
      <Cart />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default CategoryPage;