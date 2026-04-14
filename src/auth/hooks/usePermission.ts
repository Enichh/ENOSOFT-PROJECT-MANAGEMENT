import { useAuth } from '../AuthContext';
import { PERMISSIONS } from '../../types/permissions';

export function usePermission() {
  const { user } = useAuth();
  
  const userPermissions = user ? PERMISSIONS[user.role as keyof typeof PERMISSIONS] : [];
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(permission);
  };
  
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    if (userPermissions.includes('*')) return true;
    return permissions.some(permission => userPermissions.includes(permission));
  };
  
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    if (userPermissions.includes('*')) return true;
    return permissions.every(permission => userPermissions.includes(permission));
  };
  
  return {
    permissions: userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
