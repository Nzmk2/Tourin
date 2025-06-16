import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Or wherever you store it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;