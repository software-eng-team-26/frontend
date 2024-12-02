import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { CartItem } from '../components/CartItem';
import { toast } from 'react-hot-toast';
import { ShoppingCart, ArrowRight, Package } from 'lucide-react';

export function CartPage() {
  const { cart, isLoading, error, loadCart } = useCartStore();
  const { getToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
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
      localStorage.setItem('pendingCheckout', 'true');
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
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-gray-600 animate-pulse">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center bg-gray-50">
        <div className="bg-red-50 p-4 rounded-lg text-red-600 max-w-md text-center">
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => navigate('/courses')} 
            className="mt-4 text-sm text-red-700 hover:text-red-800"
          >
            Return to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          {cart.items.length > 0 && (
            <button
              onClick={() => useCartStore.getState().clearCart()}
              className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              Clear Cart
            </button>
          )}
        </div>

        {!cart.items?.length ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any courses yet.</p>
            <button
              onClick={() => navigate('/courses')}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Browse Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cart.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 text-lg pt-4 border-t">
                    <span>Total</span>
                    <span>${cart.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  
                  {!getToken() && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 text-center">
                        Sign in or create an account to complete your purchase
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}