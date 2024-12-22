export type UserRole = 'USER' | 'SALES_MANAGER' | 'PRODUCT_MANAGER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
} 