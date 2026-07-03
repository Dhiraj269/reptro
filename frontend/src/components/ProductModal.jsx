import React, { useState } from 'react';
import { FiX, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getImageURL } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductModal = ({ product, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const variant = product.variants[selectedVariant];

  const handleAddToCart = () => {
    addToCart(product, variant, quantity);
    toast.success(`${product.name} added to cart!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="product-modal-image">
          {product.image ? (
            <img src={getImageURL(product.image)} alt={product.name} />
          ) : (
            <span style={{ fontSize: 64 }}>📦</span>
          )}
        </div>

        <h3 className="product-modal-name">{product.name}</h3>
        {product.shopOwner && (
          <p className="product-modal-shop">by {product.shopOwner}</p>
        )}

        <div className="variant-options">
          <h4>Select Size / Quantity:</h4>
          <div className="variant-list">
            {product.variants.map((v, i) => (
              <div
                key={i}
                className={`variant-item ${i === selectedVariant ? 'selected' : ''}`}
                onClick={() => setSelectedVariant(i)}
              >
                <div className="variant-size">{v.size}</div>
                <div className="variant-price">₹{v.price}</div>
                {v.originalPrice && v.originalPrice > v.price && (
                  <div className="variant-original-price">₹{v.originalPrice}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Qty:</span>
          <div className="product-qty-controls" style={{ width: 'auto', display: 'inline-flex' }}>
            <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span className="qty-display" style={{ padding: '0 16px' }}>{quantity}</span>
            <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent)', marginLeft: 'auto' }}>
            ₹{variant.price * quantity}
          </span>
        </div>

        <button className="modal-add-btn" onClick={handleAddToCart}>
          <FiShoppingCart size={18} />
          Add to Cart — ₹{variant.price * quantity}
        </button>
      </div>
    </div>
  );
};

export default ProductModal;