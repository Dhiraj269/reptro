import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });

      if (data.role !== 'admin') {
        toast.error('Access denied. Admin only!');
        setLoading(false);
        return;
      }

      login(data);
      toast.success('Welcome back, ' + data.name + '!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a365d 0%, #2a4a7f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: 40,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 70,
            height: 70,
            background: 'linear-gradient(135deg, #1a365d, #e87b35)',
            borderRadius: 18,
            margin: '0 auto 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            color: '#fff'
          }}>
            <FiShield />
          </div>
          <h1 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: '#1a365d',
            marginBottom: 4
          }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Reptro Administrator Login
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#1e293b' }}>
              Admin Email
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '2px solid #e2e8f0',
              borderRadius: 10,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '12px 14px',
                background: '#f8fafc',
                borderRight: '1px solid #e2e8f0',
                color: '#64748b'
              }}>
                <FiMail size={16} />
              </div>
              <input
                type="email"
                placeholder="admin@reptro.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  border: 'none',
                  flex: 1,
                  padding: '12px 14px',
                  fontSize: 14,
                  outline: 'none'
                }}
                required
                autoFocus
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#1e293b' }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '2px solid #e2e8f0',
              borderRadius: 10,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '12px 14px',
                background: '#f8fafc',
                borderRight: '1px solid #e2e8f0',
                color: '#64748b'
              }}>
                <FiLock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  border: 'none',
                  flex: 1,
                  padding: '12px 14px',
                  fontSize: 14,
                  outline: 'none'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 14,
              background: 'linear-gradient(135deg, #1a365d, #2a4a7f)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 8
            }}
          >
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>

        <div style={{
          marginTop: 20,
          padding: 12,
          background: '#fef3c7',
          borderRadius: 8,
          fontSize: 11,
          color: '#78350f',
          textAlign: 'center',
          border: '1px solid #fcd34d'
        }}>
          This page is only for administrators
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            marginTop: 12,
            padding: 8,
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: 13
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;