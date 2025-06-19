import React, { useState, useRef } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import LogoImage from '../../assets/img/logo.png';
import { useAuth } from '../../auth/AuthContext.js';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // For dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const hideTimer = useRef();

  // Effect for scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dropdown handlers
  const handleDropdownEnter = () => {
    clearTimeout(hideTimer.current);
    setShowDropdown(true);
  };
  const handleDropdownLeave = () => {
    // Delay agar user bisa gerak ke dropdown tanpa hilang
    hideTimer.current = setTimeout(() => setShowDropdown(false), 220);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-left">
        <a href="/" className="navbar-logo">
          <img src={LogoImage} alt="Tourin" className="logo-img" />
        </a>

        <div className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input type="text" placeholder="Find Flight" className="search-input" />
        </div>
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <div
            className="user-menu"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="user-profile">
              <span className="user-name">{`${user.firstName} ${user.lastName}`}</span>
              <div className={`profile-dropdown${showDropdown ? " open" : ""}`}>
                {/* <Link to="/profile" className="dropdown-item">Profile</Link> */}
                <button onClick={logout} className="dropdown-item">Logout</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-masuk">Masuk</Link>
            <Link to="/register" className="btn-daftar">Daftar</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;