import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const { user } = useUserStore();
  const { clearToken } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Check if token is expired
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        
        if (Date.now() >= expirationTime) {
          clearToken();
          toast.error('Your session has expired. Please sign in again.');
          return;
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        clearToken();
      }
    }
  }, [clearToken]);

  if (!isAuthenticated) {
    toast.error('Please sign in to access this page');
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // Check if user has required role
  if (allowedRoles && user?.roles) {
    const hasRequiredRole = user.roles.some(role => allowedRoles.includes(role));
    if (!hasRequiredRole) {
      toast.error('You do not have permission to access this page');
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
} 