import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../services/orderApi';
import { toast } from 'react-hot-toast';

export function InvoicePage() {
  const { orderId } = useParams();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await orderApi.getInvoice(Number(orderId));
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to load invoice');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchInvoice();
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Invoice</h2>
            {pdfUrl ? (
              <div className="w-full h-[800px] border border-gray-200 rounded-lg">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="Invoice PDF"
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Failed to load invoice. Please try again later.</p>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <div className="text-sm text-gray-500">
              <p>You can download this invoice for your records.</p>
              <p>A copy has also been sent to your email.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}