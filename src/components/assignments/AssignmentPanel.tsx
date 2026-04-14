import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { Employee, EmployeeRecommendation } from '../../types/models';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import RecommendationCard from './RecommendationCard';
import Card from '../ui/Card';

interface AssignmentPanelProps {
  projectId: string;
  assignedEmployeeIds: string[];
  onAssignmentChange: (employeeIds: string[]) => void;
}

export default function AssignmentPanel({
  projectId,
  assignedEmployeeIds,
  onAssignmentChange,
}: AssignmentPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [recommendations, setRecommendations] = useState<EmployeeRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const queryClient = useQueryClient();

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => api.get<Employee[]>('/employees'),
  });

  const recommendationMutation = useMutation({
    mutationFn: () => api.post<EmployeeRecommendation[]>(`/ai/recommend`, { projectId }),
    onSuccess: (data) => {
      setRecommendations(data);
      setShowRecommendations(true);
    },
  });

  const assignMutation = useMutation({
    mutationFn: (employeeIds: string[]) =>
      api.post(`/projects/${projectId}/assign`, { employeeIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const notAssigned = !assignedEmployeeIds.includes(employee.id);
    return matchesSearch && matchesDepartment && notAssigned;
  });

  const handleAssignEmployee = (employeeId: string) => {
    onAssignmentChange([...assignedEmployeeIds, employeeId]);
    assignMutation.mutate([...assignedEmployeeIds, employeeId]);
  };

  const handleUnassignEmployee = (employeeId: string) => {
    const updatedIds = assignedEmployeeIds.filter((id) => id !== employeeId);
    onAssignmentChange(updatedIds);
    assignMutation.mutate(updatedIds);
  };

  const handleGetRecommendation = () => {
    recommendationMutation.mutate();
  };

  const handleAcceptRecommendation = (employeeId: string) => {
    handleAssignEmployee(employeeId);
    setRecommendations(recommendations.filter((r) => r.employeeId !== employeeId));
  };

  const handleRejectRecommendation = (employeeId: string) => {
    setRecommendations(recommendations.filter((r) => r.employeeId !== employeeId));
  };

  const assignedEmployees = employees.filter((emp) => assignedEmployeeIds.includes(emp.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Available Employees">
        <div className="space-y-4">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
            <option value="operations">Operations</option>
          </select>

          <div className="flex justify-end">
            <Button
              onClick={handleGetRecommendation}
              isLoading={recommendationMutation.isPending}
            >
              Get AI Recommendations
            </Button>
          </div>

          {showRecommendations && recommendations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">AI Recommendations</h3>
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.employeeId}
                  recommendation={rec}
                  onAccept={() => handleAcceptRecommendation(rec.employeeId)}
                  onReject={() => handleRejectRecommendation(rec.employeeId)}
                  isAccepted={false}
                />
              ))}
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <p className="text-gray-500">Loading employees...</p>
            ) : filteredEmployees.length === 0 ? (
              <p className="text-gray-500">No available employees</p>
            ) : (
              filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                        {employee.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.department}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleAssignEmployee(employee.id)}>
                      Assign
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      <Card title="Assigned Employees">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {assignedEmployees.length === 0 ? (
            <p className="text-gray-500">No employees assigned yet</p>
          ) : (
            assignedEmployees.map((employee) => (
              <div
                key={employee.id}
                className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                      {employee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="info" size="sm">
                          {employee.department}
                        </Badge>
                        <Badge variant="success" size="sm">
                          {employee.jobType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleUnassignEmployee(employee.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
