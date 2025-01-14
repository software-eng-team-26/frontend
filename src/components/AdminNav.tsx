import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign,
  FileText,
  Percent,
  Tags,
  BoxesIcon,
} from 'lucide-react';

export function AdminNav() {
  const location = useLocation();
  const { user } = useUserStore();
  const userRoles = user?.roles || [];
  
  const isSalesManager = userRoles.includes('SALES_MANAGER');
  const isProductManager = userRoles.includes('PRODUCT_MANAGER');
  const isAdmin = userRoles.includes('ADMIN');
  
  const navItems = [
    // Dashboard - visible to all
    { 
      path: '/admin', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      show: true 
    },
    
    // Sales Manager Items
    { 
      path: '/admin/sales', 
      icon: DollarSign, 
      label: 'Sales',
      show: isAdmin || isSalesManager 
    },
    { 
      path: '/admin/discounts', 
      icon: Percent, 
      label: 'Discounts',
      show: isAdmin || isSalesManager 
    },
    { 
      path: '/admin/invoices', 
      icon: FileText, 
      label: 'Invoices',
      show: isAdmin || isSalesManager 
    },
    
    // Product Manager Items
    { 
      path: '/admin/products', 
      icon: Package, 
      label: 'Products',
      show: isAdmin || isProductManager 
    },
    { 
      path: '/admin/categories', 
      icon: Tags, 
      label: 'Categories',
      show: isAdmin || isProductManager 
    },
    { 
      path: '/admin/stock', 
      icon: BoxesIcon, 
      label: 'Stock',
      show: isAdmin || isProductManager 
    },
  ];

  return (
    <nav className="space-y-1">
      {navItems
        .filter(item => item.show)
        .map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-6 w-6" />
              {item.label}
            </Link>
          );
      })}
    </nav>
  );
} 