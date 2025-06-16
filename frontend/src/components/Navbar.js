import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar is-info" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/admin">
          <h1 className="title is-4 has-text-white">Admin Dashboard</h1>
        </Link>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link to="/admin" className="navbar-item">
            Home
          </Link>
          <Link to="/admin/users" className="navbar-item">
            Users
          </Link>
          <Link to="/admin/airlines" className="navbar-item">
            Airlines
          </Link>
          <Link to="/admin/airports" className="navbar-item">
            Airports
          </Link>
          {/* Add more links for other entities */}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            {user ? (
              <div className="buttons">
                <p className="has-text-weight-bold mr-3">{user.email} ({user.role})</p>
                <button onClick={logout} className="button is-light">
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/" className="button is-light">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;