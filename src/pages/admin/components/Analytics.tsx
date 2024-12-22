import { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Analytics() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [3000, 3500, 4000, 3800, 4200, 4500],
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.1,
      },
      {
        label: 'Profit',
        data: [1500, 1800, 2000, 1900, 2100, 2300],
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Revenue & Profit Analysis'
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Date Range Selector */}
      <div className="mb-6 flex space-x-4">
        <div className="relative">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="pl-10 pr-4 py-2 border rounded-lg"
          />
          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative">
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="pl-10 pr-4 py-2 border rounded-lg"
          />
          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">$23,000</p>
          <p className="text-sm text-green-600 mt-2">+15% from last period</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Profit</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">$11,500</p>
          <p className="text-sm text-green-600 mt-2">+12% from last period</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Loss</h3>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2">$1,200</p>
          <p className="text-sm text-red-600 mt-2">-3% from last period</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Line options={options} data={revenueData} />
      </div>
    </div>
  );
} 