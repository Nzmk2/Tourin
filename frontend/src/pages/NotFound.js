import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="hero is-fullheight is-light">
      <div className="hero-body">
        <div className="container has-text-centered">
          <p className="title is-1">404</p>
          <p className="subtitle is-3">Page Not Found</p>
          <p>The page you are looking for does not exist.</p>
          <Link to="/" className="button is-info mt-4">Go to Login</Link>
          <Link to="/admin" className="button is-info mt-4 ml-3">Go to Admin Dashboard</Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;