import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const parseUserFromToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      return {
        userID: decoded.userID,
        email: decoded.email,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/auth/token');
      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      const decodedUser = parseUserFromToken(accessToken);
      setIsAuthenticated(true);
      setUser(decodedUser);
      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('accessToken');
      return false;
    } finally {
      setLoading(false);
    }
  }, [parseUserFromToken]);

  useEffect(() => {
    let interval;
    const verifyAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const success = await refreshToken();
        if (success) {
          interval = setInterval(refreshToken, 14 * 60 * 1000); // Refresh every 14 minutes
        } else {
          navigate('/login');
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };

    verifyAuth();
    return () => clearInterval(interval);
  }, [refreshToken, navigate]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/auth/login', { 
        email, 
        password 
      });

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      const decodedUser = parseUserFromToken(accessToken);
      setUser(decodedUser);
      setIsAuthenticated(true);

      // Redirect based on role
      if (decodedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      return decodedUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.delete('/api/auth/logout');
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if server request fails
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};