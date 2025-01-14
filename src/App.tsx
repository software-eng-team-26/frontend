import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CoursePage } from './pages/CoursePage';
import { CartPage } from './pages/CartPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { FeaturedPage } from './pages/FeaturedPage';
import { CoursesPage } from './pages/CoursesPage';
import { ProgrammingPage } from './pages/ProgrammingPage';
import { DesignPage } from './pages/DesignPage';
import { MarketingPage } from './pages/MarketingPage';
import { Toaster } from 'react-hot-toast';
import { OrdersPage } from './pages/OrdersPage';
import { AuthDebug } from './components/AuthDebug';
import { TokenDebug } from './components/TokenDebug';
import { TokenPersistenceCheck } from './components/TokenPersistenceCheck';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { TokenMonitor } from './components/TokenMonitor';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { InvoicePage } from './pages/InvoicePage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { useWishlistStore } from './store/useWishlistStore';
import { useUserStore } from './store/useUserStore';
import { WishlistPage } from './pages/WishlistPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLayout } from './pages/admin/AdminLayout';
import { DashboardOverview } from './pages/admin/components/DashboardOverview';
import { SalesManagement } from './pages/admin/components/SalesManagement';
import { DiscountManagement } from './pages/admin/components/DiscountManagement';
import { InvoiceManagement } from './pages/admin/components/InvoiceManagement';
import { Analytics } from './pages/admin/components/Analytics';
import { ProductManagement } from './pages/admin/components/ProductManagement';
import { StockManagement } from './pages/admin/components/StockManagement';
import { DeliveryManagement } from './pages/admin/components/DeliveryManagement';
import { CommentManagement } from './pages/admin/components/CommentManagement';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CategoryManagement } from './pages/admin/components/CategoryManagement';
import { RequireAdmin } from './utils/requireAdmin';

function App() {
  const { user } = useUserStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    if (user) {
      fetchWishlist(user.id);
    }
  }, [user]);

  useEffect(() => {
    // Sync token on app start
    const localToken = localStorage.getItem('jwt_token');
    const storeToken = useAuthStore.getState().token;
    
    console.log('Initial token state:', { localToken, storeToken });
    
    if (localToken && !storeToken) {
      console.log('Syncing token from localStorage to store');
      useAuthStore.getState().setToken(localToken);
    } else if (storeToken && !localToken) {
      console.log('Syncing token from store to localStorage');
      localStorage.setItem('jwt_token', storeToken);
    }
  }, []);

  console.log('API URL:', import.meta.env.VITE_API_URL); // Debug log

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <AuthDebug />
        <TokenDebug />
        <TokenPersistenceCheck />
        <TokenMonitor />
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/featured" element={<FeaturedPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/categories/programming" element={<ProgrammingPage />} />
          <Route path="/categories/design" element={<DesignPage />} />
          <Route path="/categories/marketing" element={<MarketingPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/order/:orderId" element={<OrderDetailsPage />} />
          <Route path="/order/:orderId/invoice" element={<InvoicePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/admin" element={<RequireAdmin />}>
            <Route path="" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="sales" element={<SalesManagement />} />
              <Route path="discounts" element={<DiscountManagement />} />
              <Route path="invoices" element={<InvoiceManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="stock" element={<StockManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="delivery" element={<DeliveryManagement />} />
              <Route path="comments" element={<CommentManagement />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;