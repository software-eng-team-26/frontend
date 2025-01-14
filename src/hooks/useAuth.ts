import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const { token, clearToken } = useAuthStore();
  const { user, setUser } = useUserStore();
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000; // Convert to milliseconds
          
          if (Date.now() >= expirationTime) {
            clearToken();
            setUser(null);
            setIsAuthenticated(false);
            toast.error('Your session has expired. Please sign in again.');
            return;
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing token:', error);
          clearToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkTokenExpiration();
    // Check token expiration every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [token, clearToken, setUser]);

  return { isAuthenticated };
} 