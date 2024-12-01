import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { ShoppingCart } from 'lucide-react';

export function CartIcon() {
  const { cart, loadCart } = useCartStore();
  const itemCount = cart.items.length;

  useEffect(() => {
    if (!cart.id) {
      loadCart().catch(console.error);
    }
  }, [cart.id, loadCart]);

  return (
    <Link to="/cart" className="relative">
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
} 