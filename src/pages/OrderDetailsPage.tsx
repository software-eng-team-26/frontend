import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../services/orderApi';
import { OrderStatusTracker } from '../components/OrderStatus';
import { Order } from '../types/order';
import { toast } from 'react-hot-toast';

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderApi.getOrder(Number(orderId));
        setOrder(response.data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order #{order.orderId}</h2>
            
            <OrderStatusTracker status={order.orderStatus} />
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
              <div className="mt-4 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Shipping Details</h3>
              <p className="mt-2 text-gray-600">{order.shippingAddress}</p>
              <p className="text-gray-600">{order.shippingEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 