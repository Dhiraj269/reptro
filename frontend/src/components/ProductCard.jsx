import React, { useState, useEffect } from 'react';
import { FiHeart, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getImageURL } from '../utils/helpers';

const ProductCard = ({ product, onClick }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  
  const getDefaultVariant = () => {
    if (!product.variants || product.variants.length === 0) return null;
    const availableVariant = product.variants.find(v => (v.stock || 0) > 0);
    return availableVariant || product.variants[0];
  };

  const [selectedVariant, setSelectedVariant] = useState(getDefaultVariant());

  useEffect(() => {
    setSelectedVariant(getDefaultVariant());
  }, [product]);

  if (!selectedVariant) return null;

  const qty = getItemQuantity(product._id, selectedVariant.size);
  const hasDiscount = selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price;
  const discountPercent = hasDiscount 
    ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100) 
    : 0;
  
  const stock = selectedVariant.stock || 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;
  const hasAnyStock = product.variants.some(v => (v.stock || 0) > 0);
  const hasMultipleVariants = product.variants.length > 1;
  const availableVariants = product.variants.filter(v => (v.stock || 0) > 0);
  const hasOtherSizesAvailable = availableVariants.length > 1 || 
    (availableVariants.length === 1 && availableVariants[0].size !== selectedVariant.size);

  return (
    <div className={`product-card ${!hasAnyStock ? 'product-out-of-stock' : ''}`}>
      <div className="product-image-container" onClick={onClick}>
        {discountPercent > 0 && hasAnyStock && (
          <span className="product-badge">{discountPercent}% OFF</span>
        )}
        {!hasAnyStock && (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-text">OUT OF STOCK</span>
          </div>
        )}
        <button className="product-wishlist" onClick={e => e.stopPropagation()}>
          <FiHeart size={14} />
        </button>
        {product.image ? (
          <img src={getImageURL(product.image)} alt={product.name} className="product-image" />
        ) : (
          <span style={{ fontSize: 48 }}>📦</span>
        )}
      </div>
      
      <div className="product-info">
        {/* Product Name - Only ONCE */}
        <div className="product-name" onClick={onClick}>{product.name}</div>
        
        {/* Shop Owner - Only ONCE */}
        {product.shopOwner && (
          <div className="product-shop">by {product.shopOwner}</div>
        )}
        
        {/* Description - Only ONCE */}
        {product.description && product.description.trim() && (
          <div className="product-short-desc" onClick={onClick}>
            {product.description}
          </div>
        )}
        
        {/* Size Selector */}
        {hasMultipleVariants && (
          <div className="size-selector">
            {product.variants.map((v, i) => {
              const vStock = v.stock || 0;
              const vOutOfStock = vStock === 0;
              const isSelected = v.size === selectedVariant.size;
              
              return (
                <button
                  key={i}
                  className={`size-btn ${isSelected ? 'size-btn-active' : ''} ${vOutOfStock ? 'size-btn-disabled' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!vOutOfStock) {
                      setSelectedVariant(v);
                    }
                  }}
                  disabled={vOutOfStock}
                  title={vOutOfStock ? `${v.size} - Out of Stock` : `${v.size} - ${vStock} available`}
                >
                  {v.size}
                  {vOutOfStock && <span className="size-out-badge">×</span>}
                </button>
              );
            })}
          </div>
        )}
        
        {/* Price */}
        <div className="product-price-row">
          <span className="product-price">₹{selectedVariant.price}</span>
          {hasDiscount && <span className="product-original-price">₹{selectedVariant.originalPrice}</span>}
        </div>

        {/* Stock Status */}
        <div className="product-stock-info">
          {isOutOfStock ? (
            hasOtherSizesAvailable ? (
              <span className="stock-out">❌ Size not available</span>
            ) : (
              <span className="stock-out">❌ Out of Stock</span>
            )
          ) : isLowStock ? (
            <span className="stock-low">⚠️ Only {stock} left!</span>
          ) : (
            <span className="stock-available">✅ In Stock ({stock})</span>
          )}
        </div>

        {/* Add to Cart Button */}
        {!hasAnyStock ? (
          <button className="product-notify-btn" disabled>
            Out of Stock
          </button>
        ) : isOutOfStock ? (
          <button 
            className="product-notify-btn" 
            disabled
            style={{ background: '#fef3c7', color: '#92400e', border: '2px solid #fcd34d' }}
          >
            Select Available Size
          </button>
        ) : qty === 0 ? (
          <button 
            className="product-add-btn" 
            onClick={e => { 
              e.stopPropagation(); 
              addToCart(product, selectedVariant); 
            }}
          >
            <FiPlus size={14} /> Add
          </button>
        ) : (
          <div className="product-qty-controls">
            <button 
              className="qty-btn" 
              onClick={e => { 
                e.stopPropagation(); 
                updateQuantity(product._id, selectedVariant.size, qty - 1); 
              }}
            >
              <FiMinus size={14} />
            </button>
            <span className="qty-display">{qty}</span>
            <button 
              className="qty-btn" 
              onClick={e => { 
                e.stopPropagation(); 
                if (qty < stock) {
                  updateQuantity(product._id, selectedVariant.size, qty + 1);
                }
              }}
              disabled={qty >= stock}
            >
              <FiPlus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;