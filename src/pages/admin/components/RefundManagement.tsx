import React, { useEffect, useState } from 'react';
import { orderApi } from '../../../services/orderApi';
import { OrderItem, RefundStatus } from '../../../types/order';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

interface RefundRequest {
  id: number;
  orderId: number;
  productName: string;
  quantity: number;
  price: number;
  refundStatus: RefundStatus;
  order: {
    id: number;
    userId: number;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export function RefundManagement() {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRefundRequests();
  }, []);

  const loadRefundRequests = async () => {
    try {
      setIsLoading(true);
      const response = await orderApi.getRefundRequests();
      if (response.data?.data) {
        console.log('Refund requests raw data:', JSON.stringify(response.data.data, null, 2)); // Detailed debug log
        setRefundRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error loading refund requests:', error);
      toast.error('Failed to load refund requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefundAction = async (orderId: number, itemId: number, approved: boolean) => {
    try {
      await orderApi.approveRefund(orderId, itemId, approved);
      toast.success(`Refund ${approved ? 'approved' : 'rejected'} successfully`);
      loadRefundRequests();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Refund Requests</h2>
      
      {refundRequests.length === 0 ? (
        <p className="text-gray-500">No pending refund requests</p>
      ) : (
        <div className="space-y-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {refundRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    #{request.orderId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{request.productName}</div>
                    <div className="text-sm text-gray-500">Qty: {request.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.order?.user?.firstName} {request.order?.user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.order?.user?.email || 'No email available'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${request.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${request.refundStatus === RefundStatus.REQUESTED ? 'bg-yellow-100 text-yellow-800' : 
                      request.refundStatus === RefundStatus.APPROVED ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}
                    >
                      {request.refundStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleRefundAction(request.orderId, request.id, true)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRefundAction(request.orderId, request.id, false)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 