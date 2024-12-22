import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

export function DashboardOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value="$12,345" 
          icon={<DollarSign className="w-6 h-6" />}
          trend="+12.3%"
        />
        <StatCard 
          title="Products" 
          value="123" 
          icon={<Package className="w-6 h-6" />}
          trend="+5.4%"
        />
        <StatCard 
          title="Orders" 
          value="456" 
          icon={<ShoppingCart className="w-6 h-6" />}
          trend="+8.7%"
        />
        <StatCard 
          title="Customers" 
          value="789" 
          icon={<Users className="w-6 h-6" />}
          trend="+15.2%"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}) {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
} 