import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Layout from '../components/Layout'; // Menggunakan Layout

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="pageloader is-active is-light">
        <span className="title">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If user is authenticated but doesn't have the allowed role
    return (
      <Layout> {/* Menggunakan Layout untuk halaman Access Denied */}
        <div className="section">
          <div className="container has-text-centered">
            <p className="title has-text-danger">Access Denied</p>
            <p className="subtitle">You do not have permission to view this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return children; // Render children (the protected component)
};

export default ProtectedRoute;