import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PROD_URL = import.meta.env.VITE_PROD_URL;

const axiosVisitor = axios.create({
  baseURL: BASE_URL || PROD_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosVisitor;
