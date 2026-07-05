import React, { useState } from 'react';
import { FiX, FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getImageURL } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductModal = ({ product, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  if (!product) return null;
  const variant = product.variants[selectedVariant];
  const stock = variant.stock || 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleAdd = () => {
    if (isOutOfStock) {
      toast.error('This item is out of stock!');
      return;
    }
    if (quantity > stock) {
      toast.error(`Only ${stock} items available!`);
      return;
    }
    addToCart(product, variant, quantity);
    toast.success(product.name + ' added to cart!');
    onClose();
  };

  const increaseQty = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${stock} items available!`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        
        <div className="product-modal-image" style={{ position: 'relative' }}>
          {product.image ? (
            <img src={getImageURL(product.image)} alt={product.name} />
          ) : (
            <span style={{ fontSize: 64 }}>📦</span>
          )}
          {isOutOfStock && (
            <div className="out-of-stock-overlay">
              <span className="out-of-stock-text">OUT OF STOCK</span>
            </div>
          )}
        </div>
        
        <h3 className="product-modal-name">{product.name}</h3>
        {product.shopOwner && <p className="product-modal-shop">by {product.shopOwner}</p>}

        {/* STOCK STATUS */}
        <div style={{ marginBottom: 12 }}>
          {isOutOfStock ? (
            <div style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center',
              border: '1px solid #fecaca'
            }}>
              ❌ Currently Out of Stock
            </div>
          ) : isLowStock ? (
            <div style={{
              background: '#fef3c7',
              color: '#78350f',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center',
              border: '1px solid #fcd34d'
            }}>
              ⚠️ Hurry! Only {stock} items left
            </div>
          ) : (
            <div style={{
              background: '#dcfce7',
              color: '#065f46',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center',
              border: '1px solid #86efac'
            }}>
              ✅ In Stock ({stock} available)
            </div>
          )}
        </div>
        
        <div className="variant-options">
          <h4>Select Size / Quantity:</h4>
          <div className="variant-list">
            {product.variants.map((v, i) => {
              const vStock = v.stock || 0;
              const vOutOfStock = vStock === 0;
              return (
                <div 
                  key={i} 
                  className={'variant-item ' + (i === selectedVariant ? 'selected' : '') + (vOutOfStock ? ' variant-disabled' : '')} 
                  onClick={() => !vOutOfStock && (setSelectedVariant(i), setQuantity(1))}
                  style={{ 
                    opacity: vOutOfStock ? 0.5 : 1,
                    cursor: vOutOfStock ? 'not-allowed' : 'pointer',
                    position: 'relative'
                  }}
                >
                  <div className="variant-size">{v.size}</div>
                  <div className="variant-price">₹{v.price}</div>
                  {v.originalPrice && v.originalPrice > v.price && (
                    <div className="variant-original-price">₹{v.originalPrice}</div>
                  )}
                  {vOutOfStock && (
                    <div style={{
                      fontSize: 9,
                      color: '#dc2626',
                      fontWeight: 700,
                      marginTop: 2
                    }}>
                      Out of Stock
                    </div>
                  )}
                  {!vOutOfStock && vStock <= 5 && (
                    <div style={{
                      fontSize: 9,
                      color: '#d97706',
                      fontWeight: 700,
                      marginTop: 2
                    }}>
                      Only {vStock} left
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Qty:</span>
          <div className="product-qty-controls" style={{ width: 'auto', display: 'inline-flex' }}>
            <button 
              className="qty-btn" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock}
            >
              −
            </button>
            <span className="qty-display" style={{ padding: '0 16px' }}>{quantity}</span>
            <button 
              className="qty-btn" 
              onClick={increaseQty}
              disabled={isOutOfStock || quantity >= stock}
            >
              +
            </button>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent)', marginLeft: 'auto' }}>
            ₹{variant.price * quantity}
          </span>
        </div>
        
        {isOutOfStock ? (
          <button className="modal-add-btn" disabled style={{ background: '#9ca3af', cursor: 'not-allowed' }}>
            ❌ Out of Stock
          </button>
        ) : (
          <button className="modal-add-btn" onClick={handleAdd}>
            <FiShoppingCart size={18} /> Add to Cart — ₹{variant.price * quantity}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductModal;