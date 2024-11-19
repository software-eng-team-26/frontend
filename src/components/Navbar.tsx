import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';

export function Navbar() {
  const { cart } = useCartStore();
  const { currentUser } = useUserStore();

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
              <Link to="/courses" className="text-gray-600 hover:text-gray-900 font-medium">
                Courses
              </Link>
              <Link to="/categories" className="text-gray-600 hover:text-gray-900 font-medium">
                Categories
              </Link>
              <Link to="/featured" className="text-gray-600 hover:text-gray-900 font-medium">
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