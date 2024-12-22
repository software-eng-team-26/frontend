import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './components/AdminSidebar';

export function AdminLayout() {
  return (
    <div className="min-h-screen pt-16 bg-gray-100">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 