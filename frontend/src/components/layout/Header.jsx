// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { 
  FaMugHot, 
  FaSearch, 
  FaShoppingCart, 
  FaBell, 
  FaUserCircle,
  FaHeart,
  FaHome,
  FaTags,
  FaPercent,
  FaPhone,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: 'Customer', role: 'customer' });
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(3);
  const [notificationCount, setNotificationCount] = useState(1);

  // Ambil data user dari localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          name: parsedUser.name || 'Customer',
          role: parsedUser.role || 'customer'
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Check active nav link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <FaHome /> },
    { path: '/customer/categories', label: 'Kategori', icon: <FaTags /> },
    { path: '/customer/promo', label: 'Promo', icon: <FaPercent /> },
    { path: '/customer/help', label: 'Bantuan', icon: <FaPhone /> },
  ];

  return (
    <header className="header">
      {/* TOP BAR */}
      <div className="header-top">
        <div className="container">
          {/* LOGO */}
          <div className="logo" onClick={() => navigate('/dashboard')}>
            <FaMugHot className="logo-icon" />
            <span className="logo-text">Bhumika Rupa</span>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* SEARCH BAR */}
          <form className="search-container" onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Cari vas, pot, mangkuk..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* ACTION ICONS */}
          <div className="action-icons">
            <button 
              className="icon-btn wishlist-btn"
              onClick={() => navigate('/customer/wishlist')}
            >
              <FaHeart />
              {wishlistCount > 0 && (
                <span className="badge">{wishlistCount}</span>
              )}
            </button>

            <button 
              className="icon-btn cart-btn"
              onClick={() => navigate('/customer/cart')}
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="badge">{cartCount}</span>
              )}
            </button>

            <button 
              className="icon-btn notif-btn"
              onClick={() => navigate('/customer/notifications')}
            >
              <FaBell />
              {notificationCount > 0 && (
                <span className="badge">{notificationCount}</span>
              )}
            </button>

            <div className="user-profile">
              <button 
                className="profile-btn"
                onClick={() => navigate('/customer/profile')}
              >
                <FaUserCircle className="profile-icon" />
                <span className="profile-name">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={() => navigate('/customer/profile')}>
                  <FaUserCircle /> Profil Saya
                </div>
                <div className="dropdown-item" onClick={() => navigate('/customer/orders')}>
                  <FaShoppingCart /> Pesanan Saya
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  Keluar
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="container">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;