// frontend/src/api/axios.ts
import axios from 'axios';

const instance = axios.create({
  // Added /api to the end of your live Render link
  baseURL: 'https://clarkproject.onrender.com/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;