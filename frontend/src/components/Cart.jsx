import React, { useState } from 'react';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiCreditCard, FiDollarSign, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import { calculateDeliveryCharge, getImageURL } from '../utils/helpers';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalItems, getSubtotal, clearCart, isCartOpen, setIsCartOpen, deliveryType, setDeliveryType } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderPlacedData, setOrderPlacedData] = useState(null);

  if (!isCartOpen) return null;

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();
  const hasSproutOnly = cartItems.length > 0 && cartItems.every(i => i.name?.toLowerCase().includes('sprout'));
  const deliveryCharge = hasSproutOnly ? 0 : calculateDeliveryCharge(totalItems, deliveryType);
  const total = subtotal + deliveryCharge;

  const handleCheckout = () => {
    if (cartItems.length === 0) { toast.error('Cart is empty!'); return; }
    if (!user) { toast.error('Please login first!'); return; }
    setShowConfirmModal(true);
  };

  const confirmOrder = async () => {
    setPlacing(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.productId,
          name: item.name,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryType,
        location: user.selectedLocation || 'GEC Arwal',
        deliveryAddress: user.deliveryAddress || user.selectedLocation || 'GEC Arwal',
        phone: user.phone,
        notes: '',
        paymentMethod
      };

      const { data } = await orderAPI.create(orderData);
      setOrderPlacedData(data);
      clearCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed!');
    }
    setPlacing(false);
  };

  const closeAndReset = () => {
    setShowConfirmModal(false);
    setOrderPlacedData(null);
    setIsCartOpen(false);
    setPaymentMethod('cod');
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>🛒 Your Cart ({totalItems})</h3>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}><FiX /></button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h4>Your cart is empty</h4>
              <p>Add items to get started!</p>
            </div>
          ) : cartItems.map((item, idx) => (
            <div key={idx} className="cart-item">
              <div className="cart-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {item.image ? <img src={getImageURL(item.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : '📦'}
              </div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-variant">{item.variant}</div>
                {item.stock !== undefined && item.stock <= 5 && (
  <div style={{ 
    fontSize: 10, 
    color: '#d97706', 
    fontWeight: 700,
    marginTop: 2 
  }}>
    ⚠️ Only {item.stock} left
  </div>
)}
                <div className="cart-item-price">₹{item.price * item.quantity}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div className="cart-item-qty">
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}><FiMinus size={12} /></button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}><FiPlus size={12} /></button>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.productId, item.variant)}><FiTrash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            {user && (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                📍 Delivery to: <strong>{user.deliveryAddress || user.selectedLocation || 'GEC Arwal'}</strong>
              </div>
            )}

            <div className="delivery-type-selector">
              <button className={'delivery-type-btn ' + (deliveryType === 'normal' ? 'active' : '')} onClick={() => setDeliveryType('normal')}>
                <h5>🕐 Normal</h5>
                <p>By 7 PM • ₹{Math.ceil(totalItems / 4) * 9}</p>
              </button>
              <button className={'delivery-type-btn ' + (deliveryType === 'fast' ? 'active' : '')} onClick={() => setDeliveryType('fast')}>
                <h5>⚡ Fast</h5>
                <p>30 min • ₹20</p>
              </button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>💳 Payment Method</div>
              <div className="payment-selector">
                <button className={'payment-btn ' + (paymentMethod === 'cod' ? 'active' : '')} onClick={() => setPaymentMethod('cod')}>
                  <FiDollarSign size={16} />
                  <div>
                    <div className="payment-title">COD</div>
                    <div className="payment-desc">Cash on Delivery</div>
                  </div>
                </button>
                <button className={'payment-btn ' + (paymentMethod === 'upi' ? 'active' : '')} onClick={() => setPaymentMethod('upi')}>
                  <FiCreditCard size={16} />
                  <div>
                    <div className="payment-title">UPI</div>
                    <div className="payment-desc">Pay on Delivery</div>
                  </div>
                </button>
              </div>
              {paymentMethod === 'upi' && (
                <div style={{ marginTop: 8, padding: '8px 10px', background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 6, fontSize: 11, color: '#5b21b6' }}>
                  💡 Pay via UPI to delivery boy at time of delivery
                </div>
              )}
            </div>

            <div className="cart-summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span>{hasSproutOnly ? 'FREE 🌱' : '₹' + deliveryCharge}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              style={{ background: paymentMethod === 'upi' ? '#8b5cf6' : 'var(--accent)' }}
            >
              {paymentMethod === 'upi' ? <FiCreditCard size={20} /> : <FiShoppingBag size={20} />}
              Confirm Order — ₹{total}
            </button>
            <button onClick={clearCart} style={{ width: '100%', marginTop: 8, padding: 10, background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && !orderPlacedData && (
        <div className="confirm-modal-overlay" onClick={() => !placing && setShowConfirmModal(false)}>
          <div className="confirm-modal-content" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
              <div className="confirm-modal-icon">
                <FiShoppingBag size={32} />
              </div>
              <h2>Confirm Your Order?</h2>
              <p>Please review your order before placing</p>
            </div>

            <div className="confirm-modal-body">
              {/* Delivery Info */}
              <div className="confirm-section">
                <div className="confirm-section-title">📍 Delivery Address</div>
                <div className="confirm-section-value">
                  {user?.deliveryAddress || user?.selectedLocation || 'GEC Arwal'}
                </div>
                <div className="confirm-section-sub">
                  📞 {user?.phone}
                </div>
              </div>

              {/* Items */}
              <div className="confirm-section">
                <div className="confirm-section-title">🛒 Items ({totalItems})</div>
                <div className="confirm-items-list">
                  {cartItems.map((item, i) => (
                    <div key={i} className="confirm-item-row">
                      <span className="confirm-item-name">
                        {item.name} <span className="confirm-item-variant">({item.variant})</span>
                      </span>
                      <span className="confirm-item-qty">×{item.quantity}</span>
                      <span className="confirm-item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Type & Payment */}
              <div className="confirm-info-grid">
                <div className="confirm-info-box">
                  <div className="confirm-info-label">Delivery</div>
                  <div className="confirm-info-value">
                    {deliveryType === 'fast' ? '⚡ Fast (30 min)' : '🕐 Normal (By 7 PM)'}
                  </div>
                </div>
                <div className="confirm-info-box">
                  <div className="confirm-info-label">Payment</div>
                  <div className="confirm-info-value">
                    {paymentMethod === 'upi' ? '💳 UPI on Delivery' : '💰 Cash on Delivery'}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="confirm-total-box">
                <div className="confirm-total-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="confirm-total-row">
                  <span>Delivery Charge</span>
                  <span>{hasSproutOnly ? 'FREE 🌱' : '₹' + deliveryCharge}</span>
                </div>
                <div className="confirm-total-final">
                  <span>Total to Pay</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <div className="confirm-modal-footer">
              <button
                className="confirm-btn-no"
                onClick={() => setShowConfirmModal(false)}
                disabled={placing}
              >
                ❌ No, Cancel
              </button>
              <button
                className="confirm-btn-yes"
                onClick={confirmOrder}
                disabled={placing}
              >
                {placing ? '⏳ Placing...' : '✅ Yes, Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {orderPlacedData && (
        <div className="confirm-modal-overlay" onClick={closeAndReset}>
          <div className="confirm-modal-content success-modal" onClick={e => e.stopPropagation()}>
            <div className="success-icon-wrapper">
              <FiCheckCircle size={70} color="#22c55e" />
            </div>
            <h2 className="success-title">Order Placed Successfully! 🎉</h2>
            <p className="success-subtitle">Your order is being processed</p>

            <div className="success-order-box">
              <div className="success-order-label">Order Number</div>
              <div className="success-order-number">#{orderPlacedData.orderNumber}</div>
            </div>

            <div className="success-details">
              <div className="success-detail-row">
                <FiMapPin size={14} />
                <span>{orderPlacedData.deliveryAddress || orderPlacedData.location}</span>
              </div>
              <div className="success-detail-row">
                <FiShoppingBag size={14} />
                <span>{orderPlacedData.totalItems} items • ₹{orderPlacedData.total}</span>
              </div>
              <div className="success-detail-row">
                {orderPlacedData.paymentMethod === 'upi' ? <FiCreditCard size={14} /> : <FiDollarSign size={14} />}
                <span>
                  {orderPlacedData.paymentMethod === 'upi' ? 'UPI on Delivery' : 'Cash on Delivery'}
                </span>
              </div>
            </div>

            <div className="success-message-box">
              💡 Track your order from <strong>Dashboard → My Orders</strong>
            </div>

            <button className="success-btn" onClick={closeAndReset}>
              Continue Shopping 🛍️
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;