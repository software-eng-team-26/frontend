import React, { useState } from 'react';
import { Link , useLocation } from 'react-router-dom';
import { GraduationCap, Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';

export function Navbar() {
  const { cart } = useCartStore();
  const { currentUser } = useUserStore();
  const location = useLocation();
  let timeoutId: NodeJS.Timeout;
  const isActive = (path: string) => location.pathname.startsWith(path);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  
  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search courses..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/cart" 
              className="relative flex items-center text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {currentUser ? (
              <span className="text-gray-600">
                {currentUser.email}
              </span>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}