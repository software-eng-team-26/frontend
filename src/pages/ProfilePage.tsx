import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { orderApi } from '../services/orderApi';
import { Order, OrderStatus, RefundStatus, OrderItem } from '../types/order';
import { toast } from 'react-hot-toast';
import { Package, ExternalLink, RotateCcw } from 'lucide-react';
import { OrderStatusTracker } from '../components/OrderStatus';

export function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getUserOrders();
      console.log('Profile orders response:', response);
      if (response.data?.data) {
        const rawOrders = response.data.data;
        console.log('Raw orders:', rawOrders);
        
        // Transform the data to ensure orderStatus exists
        const transformedOrders = rawOrders.map(order => ({
          ...order,
          orderStatus: order.orderStatus || OrderStatus.PROCESSING // Provide default
        }));
        
        console.log('Transformed orders:', transformedOrders);
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefundRequest = async (orderId: number, itemId: number) => {
    // Get refund reason from user
    const reason = prompt('Please provide a reason for the refund request:');
    if (!reason) {
      return; // User cancelled
    }

    try {
      await orderApi.requestRefund(orderId, itemId, reason);
      toast.success('Refund request submitted successfully. Please wait for the sales manager to review your request.');
      fetchOrders();
    } catch (error) {
      console.error('Error requesting refund:', error);
      toast.error('Failed to submit refund request');
    }
  };

  const getRefundStatusBadge = (status: RefundStatus) => {
    const styles = {
      [RefundStatus.NONE]: '',
      [RefundStatus.REQUESTED]: 'bg-yellow-100 text-yellow-800',
      [RefundStatus.PENDING]: 'bg-blue-100 text-blue-800',
      [RefundStatus.APPROVED]: 'bg-green-100 text-green-800',
      [RefundStatus.REJECTED]: 'bg-red-100 text-red-800',
      [RefundStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || '';
  };

  const getRefundStatusText = (status: RefundStatus): string => {
    switch (status) {
      case RefundStatus.NONE:
        return '';
      case RefundStatus.REQUESTED:
        return 'Refund requested - Under review';
      case RefundStatus.APPROVED:
        return 'Refund approved - Please return the product';
      case RefundStatus.PENDING_RETURN:
        return 'Awaiting product return';
      case RefundStatus.COMPLETED:
        return 'Refund completed';
      case RefundStatus.REJECTED:
        return 'Refund request rejected';
      default:
        return '';
    }
  };

  const isWithinOneMonth = (orderDate: string): boolean => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(orderDate) > oneMonthAgo;
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await orderApi.updateOrderStatus(orderId, OrderStatus.CANCELLED);
      toast.success('Order cancelled successfully');
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const canRequestRefund = (order: Order, item: OrderItem) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const orderDate = new Date(order.orderDate);

    return (
      order.orderStatus === OrderStatus.DELIVERED && // Only delivered orders
      item.refundStatus === RefundStatus.NONE && // No existing refund request
      orderDate > thirtyDaysAgo // Within 30 days of purchase
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-full">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Delivery Address: {order.shippingAddress}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {order.orderStatus}
                </span>
              </div>

              {order.orderStatus && (
                <OrderStatusTracker status={order.orderStatus} />
              )}

              <div className="border-t pt-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between py-4 border-b last:border-b-0">
                    <div className="flex flex-col gap-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.productName}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>

                      {/* Action Buttons Section */}
                      <div className="flex items-center gap-3">
                        {/* Course Access Button */}
                        {(order.orderStatus === OrderStatus.DELIVERED || 
                          order.orderStatus === OrderStatus.PROVISIONING) && 
                          item.refundStatus !== RefundStatus.APPROVED && (
                          <a 
                            href={`/course/${item.product?.id}`}
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            Go to Course <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        )}

                        {/* Cancel Button - Show for processing and provisioning orders */}
                        {(order.orderStatus === OrderStatus.PROCESSING || 
                          order.orderStatus === OrderStatus.PROVISIONING) && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="inline-flex items-center px-3 py-1 text-sm rounded-md
                              border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            Cancel Order
                          </button>
                        )}

                        {/* Refund Button - Show only for delivered orders within 30 days */}
                        {canRequestRefund(order, item) ? (
                          <button
                            onClick={() => handleRefundRequest(order.id, item.id)}
                            className="inline-flex items-center px-3 py-1 text-sm rounded-md
                              border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Request Refund
                          </button>
                        ) : order.orderStatus === OrderStatus.DELIVERED && (
                          <span className="text-xs text-gray-500">
                            {item.refundStatus !== RefundStatus.NONE 
                              ? getRefundStatusText(item.refundStatus)
                              : "Refund period expired"}
                          </span>
                        )}

                        {/* Refund Status Badge */}
                        {item.refundStatus !== RefundStatus.NONE && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getRefundStatusBadge(item.refundStatus)}`}>
                            {getRefundStatusText(item.refundStatus)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      {item.product?.originalPrice && item.product.originalPrice > item.price && (
                        <p className="text-sm text-gray-500 line-through">
                          ${item.product.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
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
      </div>
    </div>
  );
} 