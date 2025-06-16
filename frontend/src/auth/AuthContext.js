import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Ubah cara importnya
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores decoded user info (id, email, role)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/login', { email, password });
      const accessToken = response.data.accessToken;

      localStorage.setItem('accessToken', accessToken);
      const decoded = jwtDecode(accessToken);
      setUser(decoded);

      if (decoded.role === 'admin') {
        navigate('/admin');
      } else {
        // Handle regular user dashboard, if any. For now, assume admin only post-login if using this path.
        navigate('/'); // Redirect to login or a default non-admin page
        alert("You do not have admin access.");
        logout(); // Or keep logged in but deny access
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.msg || "Login failed. Please check your credentials.");
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/'); // Redirect to login page
  };

  // Function to check user's role
  const hasRole = (requiredRole) => {
    return user && user.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);