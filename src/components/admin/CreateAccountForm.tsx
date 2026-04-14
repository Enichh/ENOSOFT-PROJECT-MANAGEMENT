import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { Employee } from '../../types/models';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface CreateAccountFormProps {
  onSuccess?: () => void;
}

export default function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [temporaryPassword, setTemporaryPassword] = useState<string>('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);

  const queryClient = useQueryClient();

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => api.get<Employee[]>('/employees'),
  });

  const createAccountMutation = useMutation({
    mutationFn: (data: { email: string; password: string; role: string; employeeId: string }) =>
      api.post('/auth/create-account', data),
    onSuccess: (data: any) => {
      setCreatedCredentials({ email: data.email, password: data.temporaryPassword });
      setShowCredentials(true);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      onSuccess?.();
    },
  });

  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find((e) => e.id === selectedEmployeeId);
      if (employee) {
        setEmail(employee.email);
      }
    } else {
      setEmail('');
    }
  }, [selectedEmployeeId, employees]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedEmployeeId) {
      newErrors.employeeId = 'Please select an employee';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!temporaryPassword.trim()) {
      newErrors.password = 'Temporary password is required';
    } else if (temporaryPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      createAccountMutation.mutate({
        email,
        password: temporaryPassword,
        role,
        employeeId: selectedEmployeeId,
      });
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const handleReset = () => {
    setSelectedEmployeeId('');
    setEmail('');
    setTemporaryPassword('');
    setRole('employee');
    setErrors({});
    setShowCredentials(false);
    setCreatedCredentials(null);
  };

  const unassignedEmployees = employees.filter((emp) => {
    return !emp.email || emp.email === email;
  });

  return (
    <Card title="Create Employee Account">
      {showCredentials && createdCredentials ? (
        <div className="space-y-4">
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-success-800 mb-2">Account Created Successfully!</h3>
            <p className="text-sm text-success-700 mb-4">
              Please share these credentials with the employee. They will need to change their password on first login.
            </p>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-success-700">Email:</label>
                <p className="text-success-900 font-mono">{createdCredentials.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-success-700">Temporary Password:</label>
                <p className="text-success-900 font-mono">{createdCredentials.password}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="secondary">
              Create Another Account
            </Button>
            <Button onClick={() => setShowCredentials(false)}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.employeeId ? 'border-danger-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Choose an employee</option>
              {unassignedEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.department}
                </option>
              ))}
            </select>
            {errors.employeeId && <p className="mt-1 text-sm text-danger-600">{errors.employeeId}</p>}
          </div>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            helperText="Auto-filled from employee profile"
            required
          />

          <Input
            label="Temporary Password"
            type="text"
            value={temporaryPassword}
            onChange={(e) => setTemporaryPassword(e.target.value)}
            error={errors.password}
            helperText="Minimum 8 characters"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button type="submit" isLoading={createAccountMutation.isPending} className="w-full">
            Create Account
          </Button>
        </form>
      )}
    </Card>
  );
}
