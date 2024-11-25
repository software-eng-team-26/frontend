import { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { toast } from 'react-hot-toast';
import { Trash2, X } from 'lucide-react';
import { Course } from '../types/course';

export function CartPage() {
  const { cart, isLoading, error, fetchCart, clearCart, removeItem } = useCartStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (currentUser?.id) {
      // Assuming the cart ID is the same as the user ID for simplicity
      fetchCart(currentUser.id);
    }
  }, [currentUser, fetchCart]);

  const handleClearCart = async () => {
    if (cart?.id) {
      await clearCart(cart.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Shopping Cart</h2>
                <button
                  onClick={handleClearCart}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5 mr-1" />
                  Clear Cart
                </button>
              </div>
              
              {cart.items.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title || 'Course thumbnail'}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{item.title || 'Course'}</h3>
                      <p className="text-gray-600">${item.unitPrice}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
              <div className="flex justify-between py-2 border-b">
                <span>Subtotal</span>
                <span>${cart.totalAmount}</span>
              </div>
              <button className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}