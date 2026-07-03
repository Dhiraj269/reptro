import React from 'react';
import { FiHeart, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getImageURL } from '../utils/helpers';

const ProductCard = ({ product, onClick }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  
  const defaultVariant = product.variants?.[0];
  if (!defaultVariant) return null;
  
  const qty = getItemQuantity(product._id, defaultVariant.size);
  const hasDiscount = defaultVariant.originalPrice && defaultVariant.originalPrice > defaultVariant.price;
  const discountPercent = hasDiscount 
    ? Math.round(((defaultVariant.originalPrice - defaultVariant.price) / defaultVariant.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-image-container" onClick={onClick}>
        {discountPercent > 0 && (
          <span className="product-badge">{discountPercent}% OFF</span>
        )}
        {product.isFeatured && (
          <span className="product-badge featured">⭐</span>
        )}
        <button className="product-wishlist" onClick={(e) => e.stopPropagation()}>
          <FiHeart size={14} />
        </button>
        {product.image ? (
          <img 
  src={getImageURL(product.image)} 
  alt={`${product.name} - Buy online at Reptro GEC Arwal`}
  className="product-image" 
  loading="lazy"
  width="160"
  height="130"
/>
        ) : (
          <span style={{ fontSize: 48 }}>📦</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-name" onClick={onClick}>{product.name}</div>
        {product.shopOwner && (
          <div className="product-shop">by {product.shopOwner}</div>
        )}
        <div className="product-price-row">
          <span className="product-price">₹{defaultVariant.price}</span>
          {hasDiscount && (
            <span className="product-original-price">₹{defaultVariant.originalPrice}</span>
          )}
        </div>
        {qty === 0 ? (
          <button
            className="product-add-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (product.variants.length > 1) {
                onClick();
              } else {
                addToCart(product, defaultVariant);
              }
            }}
          >
            <FiPlus size={14} /> Add
          </button>
        ) : (
          <div className="product-qty-controls">
            <button className="qty-btn" onClick={(e) => {
              e.stopPropagation();
              updateQuantity(product._id, defaultVariant.size, qty - 1);
            }}>
              <FiMinus size={14} />
            </button>
            <span className="qty-display">{qty}</span>
            <button className="qty-btn" onClick={(e) => {
              e.stopPropagation();
              updateQuantity(product._id, defaultVariant.size, qty + 1);
            }}>
              <FiPlus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;