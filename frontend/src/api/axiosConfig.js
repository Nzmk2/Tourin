import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Jangan set Content-Type jika FormData, biar browser yang set boundary
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        console.log('Request Config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data instanceof FormData ? 'FormData' : config.data
        });
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        return response;
    },
    (error) => {
        console.error('Axios Error:', {
            config: error.config,
            response: error.response
        });
        return Promise.reject(error);
    }
);

export default axiosInstance;