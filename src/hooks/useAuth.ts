import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../types/user';

export function useAuth() {
  const { user } = useUserStore();
  const { getToken } = useAuthStore();

  const isAuthenticated = !!getToken();
  const hasRole = (role: UserRole) => user?.role === role;
  const hasAnyRole = (roles: UserRole[]) => user ? roles.includes(user.role) : false;

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isSalesManager: hasRole('SALES_MANAGER'),
    isProductManager: hasRole('PRODUCT_MANAGER'),
    isAdmin: hasRole('ADMIN'),
  };
} 