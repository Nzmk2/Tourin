import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // Logged in but doesn't have the required role
    alert("Access Denied: You do not have the necessary permissions.");
    return <Navigate to="/" replace />; // Or to a forbidden page
  }

  // Authenticated and has the correct role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;