import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { orderApi } from '../services/orderApi';
import { toast } from 'react-hot-toast';
import { Package, Clock, DollarSign, FileText } from 'lucide-react';
import { Order, OrderStatus } from '../types/order';
import { OrderStatusTracker } from '../components/OrderStatus';

export function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    fetchOrders();
  }, [currentUser, navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderApi.getUserOrders();
      console.log('Orders response:', response); // Debug log
      if (response.data?.data) {
        // Ensure we're setting an array
        setOrders(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      setOrders([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if formatting fails
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.PROCESSING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROVISIONING:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 rounded-full p-3">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Order History</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(order.orderDate)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-gray-900 font-medium">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${order.totalAmount.toFixed(2)}
                      </div>
                      <span className={`inline-block px-3 py-1 text-xs rounded-full mt-1 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Status Tracker */}
                  <div className="my-6">
                    <OrderStatusTracker status={order.status} />
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.quantity}x {item.productName}
                          </span>
                          <span className="text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex justify-end space-x-3">
                    {order.status === OrderStatus.DELIVERED && (
                      <Link
                        to={`/order/${order.id}/invoice`}
                        className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Invoice
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-600 mb-4">
                You haven't made any orders yet. Start shopping to see your orders here!
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 