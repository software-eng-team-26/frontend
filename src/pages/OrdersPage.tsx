import { useEffect } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { useUserStore } from '../store/useUserStore';

export function OrdersPage() {
  const { orders, isLoading, error, fetchUserOrders } = useOrderStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (currentUser?.id) {
      fetchUserOrders(currentUser.id);
    }
  }, [currentUser, fetchUserOrders]);

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.courseId} className="flex justify-between">
                      <span>{item.courseId}</span>
                      <span>${item.unitPrice}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.totalAmount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 