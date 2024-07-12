import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PROD_URL = import.meta.env.VITE_PROD_URL;

// create an axios instance
const axiosUser = axios.create({
  baseURL: BASE_URL || PROD_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add the axios request interceptor to attach the auth token to every request
axiosUser.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('authToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// export the configured axios instance
export default axiosUser;
