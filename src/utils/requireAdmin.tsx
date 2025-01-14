import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

export function RequireAdmin() {
  const { user } = useUserStore();

  const isAdmin = user?.email?.startsWith('sales@') || user?.email?.startsWith('product@');

  return isAdmin ? <Outlet /> : <Navigate to="/signin" />;
} 