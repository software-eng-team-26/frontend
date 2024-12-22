import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  DollarSign,
  Truck,
  MessageSquare,
  FileText,
  Percent
} from 'lucide-react';

export function AdminNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/sales', icon: DollarSign, label: 'Sales' },
    { path: '/admin/delivery', icon: Truck, label: 'Delivery' },
    { path: '/admin/invoices', icon: FileText, label: 'Invoices' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/comments', icon: MessageSquare, label: 'Comments' },
    { path: '/admin/discounts', icon: Percent, label: 'Discounts' },
  ];

  // ... rest of the component
} 