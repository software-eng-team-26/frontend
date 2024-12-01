import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { CartItem } from '../components/CartItem';
import { toast } from 'react-hot-toast';

export function CartPage() {
  const { cart, isLoading, error, loadCart } = useCartStore();
  const { getToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error('Please sign in to view your cart');
      navigate('/signin');
      return;
    }

    // Only load if cart is empty
    if (!cart.id) {
      loadCart().catch((error) => {
        console.error('Cart loading error:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Session expired. Please sign in again.');
          navigate('/signin');
        } else {
          toast.error('Failed to load cart');
        }
      });
    }
  }, [cart.id, loadCart, navigate, getToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          {cart.items.length > 0 && (
            <button
              onClick={() => useCartStore.getState().clearCart()}
              className="text-red-600 hover:text-red-800"
            >
              Clear Cart
            </button>
          )}
        </div>

        {!cart.items?.length ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/courses')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center text-xl font-bold mb-6">
                <span>Total:</span>
                <span>${cart.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/checkout')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}