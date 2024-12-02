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
    // Load cart for all users (authenticated or not)
    if (!cart.id) {
      loadCart().catch((error) => {
        console.error('Cart loading error:', error);
        toast.error('Failed to load cart');
      });
    }
  }, [cart.id, loadCart]);

  const handleProceedToCheckout = () => {
    const token = getToken();
    
    if (!token) {
      // Store cart state in localStorage before redirecting
      localStorage.setItem('pendingCheckout', 'true');
      
      // Redirect to sign in with return path
      navigate('/signin', { 
        state: { 
          from: '/checkout',
          message: 'Please sign in or create an account to complete your purchase',
          cartTotal: cart.totalAmount,
          itemCount: cart.items.length
        } 
      });
      return;
    }

    // User is authenticated, proceed to checkout
    navigate('/checkout');
  };

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

              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
                
                {/* Optional: Show sign in message for guest users */}
                {!getToken() && (
                  <p className="text-sm text-gray-500 text-center">
                    Sign in or create an account to complete your purchase
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}