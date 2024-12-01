import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export function TokenDebug() {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    console.log('Token changed:', {
      token,
      localStorage: localStorage.getItem('auth-storage'),
    });
  }, [token]);

  return null;
} 