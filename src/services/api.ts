import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const api = axios.create({
  baseURL: 'http://localhost:9191/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.method === 'post' && config.url === '/orders/create') {
      console.log('Sending order request with data:', config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); 