import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export function TokenPersistenceCheck() {
  const token = useAuthStore((state) => state.token);
  const getToken = useAuthStore((state) => state.getToken);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = getToken();
      const backupToken = localStorage.getItem('jwt_token');
      console.log('Token check:', {
        storeToken: token,
        currentToken,
        backupToken,
        localStorage: localStorage.getItem('auth-storage')
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [token, getToken]);

  return null;
} 