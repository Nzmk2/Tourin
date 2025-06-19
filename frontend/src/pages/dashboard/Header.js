import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import LogoImage from '../../assets/img/logo.png';
import { useAuth } from '../../auth/AuthContext.js'; // Import useAuth hook

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth(); // Use the auth context

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-logo">
          <img src={LogoImage} alt="Tourin" className="logo-img" />
        </a>

        {/* Search Bar */}
        <div className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input type="text" placeholder="Find Flight" className="search-input" />
        </div>
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <div className="user-menu">
            <div className="user-profile">
              <span className="user-name">{`${user.firstName} ${user.lastName}`}</span>
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">Profile</Link>
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