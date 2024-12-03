import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';
import { User, LogOut, Package } from 'lucide-react';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useUserStore();
  const { clearToken } = useAuthStore();
  const { clearCurrentUser } = useUserStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearToken();
    clearCurrentUser();
    toast.success('Signed out successfully');
    navigate('/signin');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <User className="h-6 w-6" />
        <span>{currentUser?.firstName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 text-sm text-gray-700">
            {currentUser?.firstName} {currentUser?.lastName}
          </div>
          <div className="border-t border-gray-100"></div>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => setIsOpen(false)}
          >
            <Package className="h-4 w-4" />
            <span>My Orders</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
} 