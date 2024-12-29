import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../services/orderApi'; // API çağrıları
import { useAuthStore } from '../store/useAuthStore'; // Kullanıcı oturum bilgisi
import { Order, OrderItem } from '../types/order'; // Tür tanımlamaları

export function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>(); // URL parametresinden orderId al
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // Refund seçilen ürünlerin ID'leri

  // Sipariş detaylarını yükle
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrder(Number(orderId));
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Refund checkbox kontrolü
  const toggleRefundItem = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId) // Seçiliyse çıkar
        : [...prev, itemId] // Seçili değilse ekle
    );
  };

  // Refund işlemi
  const handleRefund = async () => {
    try {
      const token = useAuthStore.getState().getToken();

      if (!token){

        alert('Authorization token is missing.')
        return;

      }
      await orderApi.refundOrder(Number(orderId), selectedItems, token);
      alert('Refund request submitted successfully.');
      setSelectedItems([]); // Seçimleri sıfırla
    } catch (error) {
      console.error('Refund request failed:', error);
      alert('Failed to submit refund request.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Order #{order.id}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Order Status: {order.status}
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
            <div className="mt-4 space-y-4">
              {order.items.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  {/* Refund Checkbox */}
                  <input
                    type="checkbox"
                    className="mr-2"
                    onChange={() => toggleRefundItem(item.id)}
                    checked={selectedItems.includes(item.id)}
                  />
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Shipping Details
              </h3>
              <p className="mt-2 text-gray-600">{order.shippingAddress}</p>
              <p className="text-gray-600">{order.shippingEmail}</p>
            </div>
            {/* Refund Button */}
            <div className="mt-6">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
                onClick={handleRefund}
                disabled={selectedItems.length === 0} // Hiç ürün seçilmediyse buton disabled
              >
                Submit Refund Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
