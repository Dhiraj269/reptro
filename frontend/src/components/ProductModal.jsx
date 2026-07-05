import React, { useState, useEffect } from 'react';
import { FiX, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getImageURL } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductModal = ({ product, onClose }) => {
  // Auto-select first available variant
  const getInitialVariantIndex = () => {
    if (!product.variants || product.variants.length === 0) return 0;
    const availableIndex = product.variants.findIndex(v => (v.stock || 0) > 0);
    return availableIndex >= 0 ? availableIndex : 0;
  };

  const [selectedVariant, setSelectedVariant] = useState(getInitialVariantIndex());
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  useEffect(() => {
    setSelectedVariant(getInitialVariantIndex());
    setQuantity(1);
  }, [product]);
  
  if (!product) return null;
  const variant = product.variants[selectedVariant];
  const stock = variant.stock || 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;
  
  // Check if any variant has stock
  const hasAnyStock = product.variants.some(v => (v.stock || 0) > 0);
  const availableCount = product.variants.filter(v => (v.stock || 0) > 0).length;

  const handleAdd = () => {
    if (isOutOfStock) {
      toast.error('This size is out of stock! Please select another size.');
      return;
    }
    if (quantity > stock) {
      toast.error(`Only ${stock} items available!`);
      return;
    }
    addToCart(product, variant, quantity);
    toast.success(product.name + ' (' + variant.size + ') added to cart!');
    onClose();
  };

  const increaseQty = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${stock} items available!`);
    }
  };

  const handleVariantSelect = (index) => {
    const v = product.variants[index];
    if ((v.stock || 0) === 0) {
      toast.error('This size is out of stock!');
      return;
    }
    setSelectedVariant(index);
    setQuantity(1);
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
          {!hasAnyStock && (
            <div className="out-of-stock-overlay">
              <span className="out-of-stock-text">OUT OF STOCK</span>
            </div>
          )}
        </div>
        
        <h3 className="product-modal-name">{product.name}</h3>
        {product.shopOwner && <p className="product-modal-shop">by {product.shopOwner}</p>}

        {/* Stock Summary */}
        {product.variants.length > 1 && (
          <div style={{
            padding: '8px 12px',
            background: hasAnyStock ? '#f0fdf4' : '#fee2e2',
            border: `1px solid ${hasAnyStock ? '#86efac' : '#fecaca'}`,
            borderRadius: 8,
            marginBottom: 12,
            fontSize: 12,
            fontWeight: 600,
            color: hasAnyStock ? '#065f46' : '#991b1b',
            textAlign: 'center'
          }}>
            {hasAnyStock ? (
              <>📦 {availableCount} of {product.variants.length} sizes available</>
            ) : (
              <>❌ All sizes currently out of stock</>
            )}
          </div>
        )}

        {/* Current Selected Variant Stock Status */}
        <div style={{ marginBottom: 12 }}>
          {isOutOfStock ? (
            <div style={{
              background: '#fef3c7',
              color: '#78350f',
              padding: '10px 12px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center',
              border: '1px solid #fcd34d'
            }}>
              ⚠️ {variant.size} is out of stock. Please select an available size below.
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
              ⚠️ Hurry! Only {stock} items left in {variant.size}
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
              ✅ {stock} items available in {variant.size}
            </div>
          )}
        </div>
        
        <div className="variant-options">
          <h4>Select Size / Quantity:</h4>
          <div className="variant-list">
            {product.variants.map((v, i) => {
              const vStock = v.stock || 0;
              const vOutOfStock = vStock === 0;
              const vLowStock = vStock > 0 && vStock <= 5;
              const isSelected = i === selectedVariant;
              
              return (
                <div 
                  key={i} 
                  className={`variant-item ${isSelected ? 'selected' : ''} ${vOutOfStock ? 'variant-disabled' : ''}`}
                  onClick={() => handleVariantSelect(i)}
                  style={{ 
                    position: 'relative',
                    opacity: vOutOfStock ? 0.5 : 1,
                    cursor: vOutOfStock ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div className="variant-size">{v.size}</div>
                  <div className="variant-price">₹{v.price}</div>
                  {v.originalPrice && v.originalPrice > v.price && (
                    <div className="variant-original-price">₹{v.originalPrice}</div>
                  )}
                  
                  {/* Stock badge for each variant */}
                  {vOutOfStock ? (
                    <div style={{
                      background: '#dc2626',
                      color: '#fff',
                      fontSize: 8,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 3,
                      marginTop: 4,
                      textAlign: 'center',
                      letterSpacing: 0.3
                    }}>
                      OUT OF STOCK
                    </div>
                  ) : vLowStock ? (
                    <div style={{
                      background: '#f59e0b',
                      color: '#fff',
                      fontSize: 8,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 3,
                      marginTop: 4,
                      textAlign: 'center',
                      letterSpacing: 0.3
                    }}>
                      ONLY {vStock} LEFT
                    </div>
                  ) : (
                    <div style={{
                      background: '#22c55e',
                      color: '#fff',
                      fontSize: 8,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 3,
                      marginTop: 4,
                      textAlign: 'center',
                      letterSpacing: 0.3
                    }}>
                      IN STOCK
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
          <button 
            className="modal-add-btn" 
            disabled 
            style={{ 
              background: '#f3f4f6', 
              color: '#6b7280',
              cursor: 'not-allowed',
              border: '2px solid #d1d5db'
            }}
          >
            ❌ {variant.size} Out of Stock
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