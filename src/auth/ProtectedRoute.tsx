import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredRole, requiredPermission }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission) {
    const { PERMISSIONS } = require('../types/permissions');
    const userPermissions = PERMISSIONS[user.role as keyof typeof PERMISSIONS];
    
    if (!userPermissions.includes('*') && !userPermissions.includes(requiredPermission)) {
      return <Navigate to="/login" />;
    }
  }

  return <>{children}</>;
}
