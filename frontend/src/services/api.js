import axios from 'axios';

/**
 * Pre-configured Axios instance for StaySphere API.
 * Automatically injects JWT Bearer token into headers if present in localStorage.
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach token
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('staySphereUser');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Failed to parse user session token', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standard error extraction
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default API;
