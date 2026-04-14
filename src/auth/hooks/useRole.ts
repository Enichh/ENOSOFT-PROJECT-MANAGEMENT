import { useAuth } from '../AuthContext';

export function useRole() {
  const { user } = useAuth();
  
  return {
    role: user?.role || null,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
    hasRole: (role: string) => user?.role === role,
  };
}
