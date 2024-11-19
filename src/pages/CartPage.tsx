import React, { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';

export function CartPage() {
  const { cart, isLoading, error, fetchCart, clearCart } = useCartStore();
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
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  Clear Cart
                </button>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item.id} className="py-6">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {/* Add course title or item name here */}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-lg font-medium text-gray-900">
                        ${item.unitPrice}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">
                      ${cart.totalAmount}
                    </dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-gray-900">
                      Total
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      ${cart.totalAmount}
                    </dd>
                  </div>
                </dl>
              </div>
              <button className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}