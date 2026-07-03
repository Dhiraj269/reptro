import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoginModal from './LoginModal';
import UserDashboard from './UserDashboard';

const Navbar = ({ onSearchClick }) => {
  const { user } = useAuth();
  const { getTotalItems, setIsCartOpen } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const totalItems = getTotalItems();

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <img 
              src="/images/logo.png" 
              alt="Reptro" 
              className="navbar-logo-img"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="navbar-logo-icon" style={{ display: 'none' }}>R</div>
            <div className="navbar-logo-text">
              <h1>Reptro</h1>
              <span>Daily Needs • Your Doorstep</span>
            </div>
          </Link>
          <div className="navbar-actions">
            <button className="nav-btn nav-search-btn" onClick={onSearchClick}><FiSearch size={18} /></button>
            <button className="nav-btn nav-user-btn" onClick={() => user ? setShowDashboard(true) : setShowLogin(true)}>
              <FiUser size={16} /><span>{user ? user.name.split(' ')[0] : 'Login'}</span>
            </button>
            <button className="nav-btn nav-cart-btn" onClick={() => setIsCartOpen(true)}>
              <FiShoppingCart size={16} /><span>{totalItems} Items</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>
        </div>
      </nav>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showDashboard && <UserDashboard onClose={() => setShowDashboard(false)} />}
    </>
  );
};

export default Navbar;