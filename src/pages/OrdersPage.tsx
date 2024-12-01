import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi, Order } from '../services/orderApi';
import { toast } from 'react-hot-toast';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderApi.getMyOrders();
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (orderId: number) => {
    try {
      const invoice = await orderApi.getInvoice(orderId);
      const url = window.URL.createObjectURL(invoice);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen pt-24 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.orderId}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {order.orderStatus}
                </span>
              </div>
              
              <div className="border-t pt-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
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
              
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => downloadInvoice(order.orderId)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 