import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  DollarSign, 
  Package, 
  FileText, 
  Truck, 
  MessageSquare, 
  Tag,
  BarChart,
  FolderTree
} from 'lucide-react';

export function AdminSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 min-h-[calc(100vh-4rem)] bg-white shadow-sm">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
      </div>
      <nav className="mt-4">
        <SidebarLink 
          to="/admin"
          icon={<LayoutDashboard />} 
          label="Dashboard" 
          active={isActive('/admin')}
        />
        
        {/* Sales Manager Section */}
        <div className="px-4 py-2 mt-6">
          <h3 className="text-sm font-semibold text-gray-500">SALES MANAGEMENT</h3>
        </div>
        <SidebarLink 
          to="/admin/sales"
          icon={<DollarSign />} 
          label="Sales" 
          active={isActive('/admin/sales')}
        />
        <SidebarLink 
          to="/admin/discounts"
          icon={<Tag />} 
          label="Discounts" 
          active={isActive('/admin/discounts')}
        />
        <SidebarLink 
          to="/admin/invoices"
          icon={<FileText />} 
          label="Invoices" 
          active={isActive('/admin/invoices')}
        />
        <SidebarLink 
          to="/admin/analytics"
          icon={<BarChart />} 
          label="Analytics" 
          active={isActive('/admin/analytics')}
        />
        {/* Refund Management */}
        <SidebarLink
          active={isActive('/admin/refunds')}
          icon="refresh" // İlgili ikon.
          label="Refund Management"
          to="/admin/refunds"
        />


        {/* Product Manager Section */}
        <div className="px-4 py-2 mt-6">
          <h3 className="text-sm font-semibold text-gray-500">PRODUCT MANAGEMENT</h3>
        </div>
        <SidebarLink 
          to="/admin/products"
          icon={<Package />} 
          label="Products" 
          active={isActive('/admin/products')}
        />
        <SidebarLink 
          to="/admin/categories"
          icon={<FolderTree />} 
          label="Categories" 
          active={isActive('/admin/categories')}
        />
        <SidebarLink 
          to="/admin/stock"
          icon={<Package />} 
          label="Stock" 
          active={isActive('/admin/stock')}
        />
        <SidebarLink 
          to="/admin/delivery"
          icon={<Truck />} 
          label="Delivery" 
          active={isActive('/admin/delivery')}
        />
        <SidebarLink 
          to="/admin/comments"
          icon={<MessageSquare />} 
          label="Comments" 
          active={isActive('/admin/comments')}
        />
      </nav>
    </div>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function SidebarLink({ to, icon, label, active }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={`w-full flex items-center space-x-2 px-4 py-2 text-sm ${
        active 
          ? 'text-indigo-600 bg-indigo-50 font-medium' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
} 