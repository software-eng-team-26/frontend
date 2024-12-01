import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';

export function AuthDebug() {
  const token = useAuthStore((state) => state.token);
  const currentUser = useUserStore((state) => state.currentUser);

  useEffect(() => {
    console.log('Auth Debug State:', {
      token,
      currentUser,
      localStorage: {
        auth: localStorage.getItem('auth-storage'),
        user: localStorage.getItem('user-storage')
      }
    });
  }, [token, currentUser]);

  return null;
} 