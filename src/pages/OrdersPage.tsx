import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../services/orderApi';
import { Order, OrderStatus } from '../types/order';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { OrderStatusTracker } from '../components/OrderStatus';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderApi.getUserOrders();
      console.log('Full response structure:', {
        data: response.data,
        rawData: JSON.stringify(response.data, null, 2)
      });

      if (response.data?.data) {
        const rawOrders = response.data.data;
        console.log('Raw orders:', rawOrders);
        
        // Transform the data to ensure orderStatus exists
        const transformedOrders = rawOrders.map(order => ({
          ...order,
          orderStatus: order.orderStatus || order.status || OrderStatus.PROCESSING // Provide default
        }));
        
        console.log('Transformed orders:', transformedOrders);
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
            <button
              onClick={() => navigate('/courses')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {order.orderStatus}
                  </span>
                </div>

                {order.orderStatus && (
                  <OrderStatusTracker 
                    status={order.orderStatus as OrderStatus} 
                  />
                )}
                
                <div className="border-t pt-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 