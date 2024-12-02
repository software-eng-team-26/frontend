import { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export const CartSync = () => {
  const syncWithServer = useCartStore(state => state.syncWithServer);
  const transferGuestCart = useCartStore(state => state.transferGuestCart);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    if (token) {
      // When user logs in, first transfer guest cart items
      transferGuestCart().then(() => {
        // Then sync with server
        syncWithServer().catch(error => {
          if (error?.response?.status === 403) {
            useAuthStore.getState().clearToken();
          } else {
            console.error('Failed to sync cart:', error);
          }
        });
      });
    }
  }, [token, syncWithServer, transferGuestCart]);

  return null;
}; 