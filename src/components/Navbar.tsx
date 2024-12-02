import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Search, ShoppingCart, ChevronDown } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';
import { CartIcon } from './CartIcon';
import { UserMenu } from './UserMenu';
import { AuthButtons } from './AuthButtons';

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
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-200 ${
      isScrolled ? 'shadow-md' : 'border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EduMart
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/courses"
                className={`relative group text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 ${
                  isActive("/courses") ? "text-indigo-600 font-bold" : ""
                }`}
              >
                Courses
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform origin-left scale-x-0 transition-transform duration-200 ${
                  isActive("/courses") ? "scale-x-100" : "group-hover:scale-x-100"
                }`}></span>
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 ${
                    isActive("/categories") ? "text-indigo-600 font-bold" : ""
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden transform origin-top transition-all duration-200">
                    <div className="py-1">
                      <Link
                        to="/categories/programming"
                        className="block px-4 py-2.5 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                      >
                        Programming
                      </Link>
                      <Link
                        to="/categories/design"
                        className="block px-4 py-2.5 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                      >
                        Design
                      </Link>
                      <Link
                        to="/categories/marketing"
                        className="block px-4 py-2.5 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                      >
                        Marketing
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/featured"
                className={`relative group text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 ${
                  isActive("/featured") ? "text-indigo-600 font-bold" : ""
                }`}
              >
                Featured
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform origin-left scale-x-0 transition-transform duration-200 ${
                  isActive("/featured") ? "scale-x-100" : "group-hover:scale-x-100"
                }`}></span>
              </Link>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-8">
            <div className="max-w-lg w-full">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="Search courses..."
                />
              </form>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {currentUser ? (
              <>
                <Link 
                  to="/cart" 
                  className="relative hover:opacity-80 transition-opacity"
                >
                  <CartIcon />
                </Link>
                <UserMenu />
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link 
                  to="/cart" 
                  className="relative hover:opacity-80 transition-opacity"
                >
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