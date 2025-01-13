import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Search, ShoppingCart, Heart, ChevronDown } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';
import { CartIcon } from './CartIcon';
import { UserMenu } from './UserMenu';
import { AuthButtons } from './AuthButtons';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { cart } = useCartStore();
  const { currentUser } = useUserStore();
  const { clearToken } = useAuthStore();
  const { clearCurrentUser } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();
  let timeoutId: NodeJS.Timeout;
  const isActive = (path: string) => location.pathname.startsWith(path);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated } = useAuth();

  const showAdminLink = isAuthenticated;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = () => {
    clearToken();
    clearCurrentUser();
    toast.success('Signed out successfully');
    navigate('/signin');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">EduMart</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
      <Link
        to="/courses"
        className={`text-gray-600 hover:text-gray-900 font-medium ${
          isActive("/courses") ? "text-indigo-600 font-bold" : ""
        }`}
      >
        Courses
      </Link>
      {/* Categories Dropdown */}
      <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                
                
                >
                
              
                <span
                  className={`text-gray-600 hover:text-gray-900 font-medium cursor-pointer ${
                    isActive("/categories") ? "text-indigo-600 font-bold" : ""
                  }`}
                  
                >
                  Categories
                </span>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
                 
                    <Link
                      to="/categories/programming"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Programming
                    </Link>
                    <Link
                      to="/categories/design"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Design
                    </Link>
                    <Link
                      to="/categories/marketing"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Marketing
                    </Link>
                  </div>
                )}
              </div>
      <Link
        to="/featured"
        className={`text-gray-600 hover:text-gray-900 font-medium ${
          isActive("/featured") ? "text-indigo-600 font-bold" : ""
        }`}
      >
                Featured
              </Link>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-8">
            <div className="max-w-lg w-full">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search courses..."
                />
              </form>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Heart className="w-6 h-6" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative">
                  <CartIcon />
                </Link>
                <div className="relative group">
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center space-x-1"
                  >
                    <span>Admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </Link>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link
                      to="/admin/sales"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sales Management
                    </Link>
                    {/* <Link
                      to="/admin/discounts"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Discounts
                    </Link> */}
                    <Link
                      to="/admin/invoices"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Invoices
                    </Link>
                    <Link
                      to="/admin/analytics"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Analytics
                    </Link>
                  </div>
                </div>
                <UserMenu />
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/wishlist"
                  className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Heart className="w-6 h-6" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative">
                  <CartIcon />
                </Link>
                <AuthButtons />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}