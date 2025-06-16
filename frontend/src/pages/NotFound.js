import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'; // Opsional, jika ingin layout pada halaman 404

const NotFound = () => {
  return (
    <Layout> {/* Atau langsung section jika tidak perlu sidebar/navbar */}
      <section className="hero is-fullheight is-fullwidth">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title is-1 has-text-danger">404</h1>
            <h2 className="subtitle is-3">Page Not Found</h2>
            <p className="mb-4">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <Link to="/admin" className="button is-info is-light">Go to Dashboard</Link>
            <Link to="/login" className="button is-link is-light ml-3">Go to Login</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;