import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export function TokenMonitor() {
  useEffect(() => {
    const checkToken = () => {
      const storeToken = useAuthStore.getState().token;
      const localToken = localStorage.getItem('jwt_token');
      
      console.log('Token check:', {
        storeToken,
        localToken,
        match: storeToken === localToken
      });
    };

    checkToken();
    const interval = setInterval(checkToken, 5000);
    return () => clearInterval(interval);
  }, []);

  return null;
} 