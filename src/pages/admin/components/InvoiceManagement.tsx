import { useEffect, useState } from 'react';
import { Search, FileText, Download, Eye, Calendar } from 'lucide-react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { orderApi } from '../../../services/orderApi';
import { format } from 'date-fns';
import { Order } from '../../../types/order';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function InvoiceManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [revenueData, setRevenueData] = useState({
    revenue: 0,
    profit: 0,
    chartData: {
      labels: [],
      datasets: []
    }
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderApi.getAllOrders();
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInvoice = async (orderId: number) => {
    try {
      setSelectedOrder(orderId);
      const response = await orderApi.getInvoice(orderId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to load invoice');
    }
  };

  const handleDownloadInvoice = async (orderId: number) => {
    try {
      const response = await orderApi.getInvoice(orderId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const filteredOrders = orders.filter(order => 
    order.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toString().includes(searchQuery)
  );

  const getFilteredOrders = () => {
    return orders.filter(order => {
      if (!dateRange.startDate && !dateRange.endDate) return true;
      
      const orderDate = new Date(order.orderDate);
      const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
      const end = dateRange.endDate ? new Date(dateRange.endDate) : null;
      
      if (start && end) {
        return orderDate >= start && orderDate <= end;
      } else if (start) {
        return orderDate >= start;
      } else if (end) {
        return orderDate <= end;
      }
      return true;
    });
  };

  const calculateRevenue = () => {
    const filteredOrders = getFilteredOrders();
    
    const ordersByDate = filteredOrders.reduce((acc, order) => {
      const date = format(new Date(order.orderDate), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {
          revenue: 0,
          profit: 0
        };
      }
      acc[date].revenue += order.totalAmount;
      acc[date].profit += order.totalAmount * 0.3;
      return acc;
    }, {});

    const dates = Object.keys(ordersByDate).sort();
    const chartData = {
      labels: dates.map(date => format(new Date(date), 'MMM dd')),
      datasets: [
        {
          label: 'Revenue',
          data: dates.map(date => ordersByDate[date].revenue),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Profit',
          data: dates.map(date => ordersByDate[date].profit),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }
      ]
    };

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalProfit = totalRevenue * 0.3;

    setRevenueData({
      revenue: totalRevenue,
      profit: totalProfit,
      chartData
    });
  };

  useEffect(() => {
    calculateRevenue();
  }, [orders, dateRange]);

  const handleBulkDownload = async () => {
    try {
      const filteredOrders = getFilteredOrders();
      for (const order of filteredOrders) {
        await handleDownloadInvoice(order.id);
      }
      toast.success('All invoices downloaded successfully');
    } catch (error) {
      toast.error('Failed to download some invoices');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoice Management</h1>

      {/* Date Range and Search */}
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <button
            onClick={handleBulkDownload}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Download All Invoices
          </button>
        </div>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">${revenueData.revenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Profit</h3>
          <p className="text-3xl font-bold text-green-600">${revenueData.profit.toFixed(2)}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue & Profit Chart</h3>
        <div className="h-80">
          <Line
            data={revenueData.chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${value}`
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
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
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.user?.firstName} {order.user?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{order.shippingEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                    order.orderStatus === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewInvoice(order.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(order.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Preview Modal */}
      {selectedOrder && pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Invoice Preview</h3>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setPdfUrl(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <iframe
                src={pdfUrl}
                className="w-full h-[600px]"
                title="Invoice Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 