import React, { useState } from 'react';
import { FiX, FiPhone } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginModal = ({ onClose }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [needsPhone, setNeedsPhone] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [phone, setPhone] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { data } = await authAPI.googleLogin(credentialResponse.credential);

      if (data.needsPhone) {
        setTempData(data.tempData);
        setNeedsPhone(true);
        toast('Please enter your mobile number', { icon: '📱' });
      } else {
        login(data);
        toast.success(`Welcome ${data.name}! 🎉`);
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
    }
    setLoading(false);
  };

  const handleGoogleError = () => {
    toast.error('Google login cancelled');
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Enter valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authAPI.googleComplete({
        ...tempData,
        phone: phone.trim()
      });

      login(data);
      toast.success(`Welcome ${data.name}! 🎉`);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>

        {!needsPhone ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 60, height: 60,
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                borderRadius: 16,
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                color: '#fff',
                fontWeight: 900
              }}>R</div>
              <h2 className="modal-title" style={{ textAlign: 'center' }}>Welcome to Reptro!</h2>
              <p className="modal-subtitle" style={{ textAlign: 'center' }}>
                Sign in to place your order 🚀
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              border: '1px solid #bae6fd'
            }}>
              <p style={{ fontSize: 12, color: '#0369a1', fontWeight: 600, textAlign: 'center', marginBottom: 6 }}>
                🔒 Secure & Fast Login
              </p>
              <p style={{ fontSize: 11, color: '#075985', textAlign: 'center', lineHeight: 1.5 }}>
                One-click sign in with Google. We'll ask for your mobile number for delivery.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="300"
              />
            </div>

            {loading && (
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
                Signing you in...
              </div>
            )}

            <div style={{
              marginTop: 20,
              padding: 12,
              background: 'var(--bg-secondary)',
              borderRadius: 8,
              fontSize: 11,
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              By continuing, you agree to Reptro's Terms of Service and Privacy Policy
            </div>
          </>
        ) : (
          <>
            <h2 className="modal-title">📱 Almost There!</h2>
            <p className="modal-subtitle">
              We need your mobile number for delivery updates
            </p>

            {tempData && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                background: 'var(--bg-secondary)',
                borderRadius: 12,
                marginBottom: 16
              }}>
                {tempData.picture && (
                  <img
                    src={tempData.picture}
                    alt={tempData.name}
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                  />
                )}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{tempData.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{tempData.email}</div>
                </div>
              </div>
            )}

            <form onSubmit={handlePhoneSubmit}>
              <div className="form-group">
                <label>Mobile Number *</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '12px 14px',
                    background: 'var(--bg-secondary)',
                    borderRight: '1px solid var(--border)',
                    fontWeight: 700,
                    fontSize: 14
                  }}>
                    +91
                  </div>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ border: 'none', flex: 1, padding: '12px 14px', fontSize: 14, outline: 'none' }}
                    required
                    maxLength={10}
                    autoFocus
                  />
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                  We'll use this for order updates & delivery
                </p>
              </div>

              <button
                type="submit"
                className="form-submit-btn"
                disabled={loading || phone.length !== 10}
                style={{ marginTop: 8 }}
              >
                {loading ? 'Creating account...' : '✅ Complete Signup'}
              </button>
            </form>

            <button
              onClick={() => { setNeedsPhone(false); setPhone(''); setTempData(null); }}
              style={{
                width: '100%',
                marginTop: 12,
                padding: 8,
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              ← Use different account
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;