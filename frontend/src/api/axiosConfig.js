import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Sesuaikan dengan port backend Anda
  withCredentials: true, // Penting untuk mengirim cookie (refresh token)
});

// Optional: Interceptor untuk menambahkan access token ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;