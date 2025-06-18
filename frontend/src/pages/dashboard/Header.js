import React, { useState } from 'react';
import './Header.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import LogoImage from '../../assets/img/logo.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu if you want to add it later

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/*Replace with your actual logo or text */}
        <a href="/" className="navbar-logo">
          <img src={LogoImage} alt="Tourin" className="logo-img" />
          <span className="logo-text"></span>
        </a>

        {/* Search Bar */}
        <div className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input type="text" placeholder="Penerbangan ke Surabaya" className="search-input" />
        </div>
      </div>

      <div className="navbar-center">
        <ul className="nav-list">
          <li className="nav-item">
            <a href="/" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="/about" className="nav-link">About Us</a>
          </li>
          <li className="nav-item">
            <a href="/destination" className="nav-link">Destination</a>
          </li>
          <li className="nav-item">
            <a href="/packages" className="nav-link">Packages</a>
          </li>
          <li className="nav-item">
            <a href="/gallery" className="nav-link">Gallery</a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link">Contact Us</a>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        {/* Changed to Link components */}
        <Link to="/login" className="btn-masuk">Masuk</Link>
        <Link to="/register" className="btn-daftar">Daftar</Link>
      </div>

      {/* Optional: Mobile menu toggle button */}
      {/* If you implement a mobile menu, uncomment this and its corresponding CSS */}
      {/* <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </div>
      {isMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item"><a href="/" className="mobile-nav-link">Home</a></li>
            <li className="mobile-nav-item"><a href="/about" className="mobile-nav-link">About Us</a></li>
            <li className="mobile-nav-item"><a href="/destination" className="mobile-nav-link">Destination</a></li>
            <li className="mobile-nav-item"><a href="/packages" className="mobile-nav-link">Packages</a></li>
            <li className="mobile-nav-item"><a href="/gallery" className="mobile-nav-item">Gallery</a></li>
            <li className="mobile-nav-item"><a href="/contact" className="mobile-nav-item">Contact Us</a></li>
          </ul>
          <div className="mobile-auth-buttons">
            <Link to="/login" className="btn-masuk-mobile">Masuk</Link>
            <Link to="/register" className="btn-daftar-mobile">Daftar</Link>
          </div>
        </div>
      )} */}
    </nav>
  );
};

export default Header;