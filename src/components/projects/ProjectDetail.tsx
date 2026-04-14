import React from 'react';
import { Project, Employee } from '../../types/models';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ProjectDetailProps {
  project: Project;
  assignedEmployees?: Employee[];
  onEdit?: () => void;
  onDelete?: () => void;
  onGetRecommendation?: () => void;
  isRecommendationLoading?: boolean;
}

const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    planning: 'default',
    inProgress: 'info',
    review: 'warning',
    completed: 'success',
    cancelled: 'danger',
  };
  return variants[status] || 'default';
};

const getPriorityVariant = (priority: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    low: 'success',
    medium: 'info',
    high: 'warning',
    critical: 'danger',
  };
  return variants[priority] || 'default';
};

export default function ProjectDetail({
  project,
  assignedEmployees = [],
  onEdit,
  onDelete,
  onGetRecommendation,
  isRecommendationLoading = false,
}: ProjectDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <div className="flex gap-2 mt-2">
              <Badge variant={getStatusVariant(project.status)}>
                {project.status.replace(/([A-Z])/g, ' $1').trim()}
              </Badge>
              <Badge variant={getPriorityVariant(project.priority)}>
                {project.priority} priority
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="secondary" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-gray-900">{project.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date</h3>
              <p className="text-gray-900">{formatDate(project.startDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
              <p className="text-gray-900">{formatDate(project.deadline)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Assigned Employees</h3>
          {onGetRecommendation && (
            <Button onClick={onGetRecommendation} isLoading={isRecommendationLoading}>
              Get AI Recommendation
            </Button>
          )}
        </div>

        {assignedEmployees.length === 0 ? (
          <p className="text-gray-500">No employees assigned to this project</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedEmployees.map((employee) => (
              <div
                key={employee.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
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
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
