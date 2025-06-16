import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
        id: decoded.userId,
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
      const response = await axiosInstance.get('/token');
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
          interval = setInterval(refreshToken, 10 * 60 * 1000);
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
  console.log("Attempting login for:", email); // <-- Tambahkan ini
  try {
    const response = await axiosInstance.post('/login', { email, password });
    const accessToken = response.data.accessToken;
    localStorage.setItem('accessToken', accessToken);
    console.log("Access Token received and stored:", accessToken); // <-- Tambahkan ini

    const decodedUser = parseUserFromToken(accessToken);
    setIsAuthenticated(true);
    setUser(decodedUser);
    console.log("User authenticated and set:", decodedUser); // <-- Tambahkan ini

    navigate('/admin'); // Redirect ke /admin
    console.log("Navigating to /admin"); // <-- Tambahkan ini

  } catch (error) {
    console.error("Login error:", error); // <-- Pastikan ini ada dan perhatikan outputnya
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('accessToken');
    throw error;
  } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
        // --- PASTIKAN BARIS INI BENAR ---
        // Jika Anda menggunakan axiosInstance yang diatur base URL-nya
        await axiosInstance.post('/logout'); // PASTIKAN METHODNYA POST dan URLNYA '/logout'

        // Atau jika Anda memanggil langsung axios tanpa instance:
        // await axios.post('http://localhost:5000/logout'); // PASTIKAN URL LENGKAP DAN METHOD POST

        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login'); // Arahkan ke halaman login setelah logout berhasil
        console.log("Logged out successfully");
    } catch (error) {
        console.error("Logout error:", error);
        // Meskipun ada error dari backend (misal 404), tetap hapus token di frontend
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};