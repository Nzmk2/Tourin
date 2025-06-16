import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const toggleBurgerMenu = () => {
    const burger = document.querySelector('.navbar-burger');
    const menu = document.querySelector('.navbar-menu');
    if (burger && menu) {
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-active');
    }
  };

  return (
    <nav className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/admin" className="navbar-item">
          <strong className="has-text-info is-size-4">Tourin Admin</strong>
        </Link>

        <button
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={toggleBurgerMenu}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            {user && (
              <p className="mr-3">Welcome, <strong className="has-text-info">{user.firstName} ({user.role})</strong></p>
            )}
            <div className="buttons">
              <button onClick={logout} className="button is-light">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;