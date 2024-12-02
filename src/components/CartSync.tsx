import { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export const CartSync = () => {
  const { cart, transferGuestCart } = useCartStore();
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const handleCartTransfer = async () => {
      if (token && cart.items.length > 0) {
        try {
          await transferGuestCart();
        } catch (error) {
          console.error('Failed to transfer cart:', error);
        }
      }
    };

    handleCartTransfer();
  }, [token, cart.items.length, transferGuestCart]);

  return null;
}; 