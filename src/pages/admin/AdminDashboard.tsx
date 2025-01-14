import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  LayoutDashboard, 
  DollarSign, 
  Package, 
  FileText, 
  Truck, 
  MessageSquare, 
  Tag,
  BarChart
} from 'lucide-react';
import { DashboardOverview } from './components/DashboardOverview';
import { DiscountManagement } from './components/DiscountManagement';
import { InvoiceManagement } from './components/InvoiceManagement';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { getToken } = useAuthStore();
  const navigate = useNavigate();

  // Check for admin access
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/signin');
      return;
    }
    // TODO: Add role check when backend supports it
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'sales':
        return <SalesManagement />;
      case 'products':
        return <ProductManagement />;
      case 'discounts':
        return <DiscountManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'delivery':
        return <DeliveryManagement />;
      case 'comments':
        return <CommentManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-sm">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
          </div>
          <nav className="mt-4">
            <SidebarLink 
              icon={<LayoutDashboard />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            
            {/* Sales Manager Section */}
            <div className="px-4 py-2 mt-6">
              <h3 className="text-sm font-semibold text-gray-500">SALES MANAGEMENT</h3>
            </div>
            <SidebarLink 
              icon={<DollarSign />} 
              label="Sales" 
              active={activeTab === 'sales'} 
              onClick={() => setActiveTab('sales')} 
            />
            {/* <SidebarLink 
              icon={<Tag />} 
              label="Discounts" 
              active={activeTab === 'discounts'} 
              onClick={() => setActiveTab('discounts')} 
            /> */}
            <SidebarLink 
              icon={<FileText />} 
              label="Invoices" 
              active={activeTab === 'invoices'} 
              onClick={() => setActiveTab('invoices')} 
            />
            <SidebarLink 
              icon={<BarChart />} 
              label="Analytics" 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')} 
            />

            {/* Product Manager Section */}
            <div className="px-4 py-2 mt-6">
              <h3 className="text-sm font-semibold text-gray-500">PRODUCT MANAGEMENT</h3>
            </div>
            <SidebarLink 
              icon={<Package />} 
              label="Products" 
              active={activeTab === 'products'} 
              onClick={() => setActiveTab('products')} 
            />
            <SidebarLink 
              icon={<Truck />} 
              label="Delivery" 
              active={activeTab === 'delivery'} 
              onClick={() => setActiveTab('delivery')} 
            />
            <SidebarLink 
              icon={<MessageSquare />} 
              label="Comments" 
              active={activeTab === 'comments'} 
              onClick={() => setActiveTab('comments')} 
            />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Sidebar Link Component
function SidebarLink({ icon, label, active, onClick }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-2 px-4 py-2 text-sm ${
        active 
          ? 'text-indigo-600 bg-indigo-50 font-medium' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
} 