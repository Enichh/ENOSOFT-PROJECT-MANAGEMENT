import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { Employee } from '../../types/models';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmployeeModal from '../../components/employees/EmployeeModal';
import EmployeeCard from '../../components/employees/EmployeeCard';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const queryClient = useQueryClient();

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => api.get<Employee[]>('/employees'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesJobType = jobTypeFilter === 'all' || employee.jobType === jobTypeFilter;
    const matchesCategory = categoryFilter === 'all' || employee.category === categoryFilter;

    return matchesSearch && matchesDepartment && matchesJobType && matchesCategory;
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(undefined);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmitEmployee = async (data: any) => {
    if (selectedEmployee) {
      await api.put(`/employees/${selectedEmployee.id}`, data);
    } else {
      await api.post('/employees', data);
    }
    queryClient.invalidateQueries({ queryKey: ['employees'] });
  };

  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'email' as const, label: 'Email' },
    {
      key: 'department' as const,
      label: 'Department',
      render: (value: unknown) => (
        <span className="capitalize">{String(value)}</span>
      ),
    },
    {
      key: 'jobType' as const,
      label: 'Job Type',
      render: (value: unknown) => (
        <span className="capitalize">{String(value)}</span>
      ),
    },
    {
      key: 'category' as const,
      label: 'Category',
      render: (value: unknown) => (
        <span className="capitalize">{String(value)}</span>
      ),
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (_: unknown, row: Record<string, unknown>) => {
        const employee = row as unknown as Employee;
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => handleEditEmployee(employee)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDeleteEmployee(employee.id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'card' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('card')}
          >
            Card View
          </Button>
          <Button onClick={handleAddEmployee}>Add Employee</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
            <option value="operations">Operations</option>
          </select>
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Job Types</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            <option value="fullTime">Full Time</option>
            <option value="partTime">Part Time</option>
            <option value="contractor">Contractor</option>
            <option value="intern">Intern</option>
          </select>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <DataTable
            data={filteredEmployees as unknown as Record<string, unknown>[]}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No employees found"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={() => handleEditEmployee(employee)}
              onDelete={() => handleDeleteEmployee(employee.id)}
            />
          ))}
        </div>
      )}

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitEmployee}
        employee={selectedEmployee}
      />
    </div>
  );
}
