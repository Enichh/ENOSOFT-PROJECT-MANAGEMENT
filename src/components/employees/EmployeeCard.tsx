import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { Employee } from '../../types/models';

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getDepartmentVariant = (dept: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    engineering: 'info',
    design: 'success',
    marketing: 'warning',
    sales: 'danger',
    hr: 'default',
    operations: 'default',
  };
  return variants[dept] || 'default';
};

const getJobTypeVariant = (type: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    remote: 'success',
    onsite: 'info',
    hybrid: 'warning',
  };
  return variants[type] || 'default';
};

const getCategoryVariant = (cat: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    fullTime: 'success',
    partTime: 'warning',
    contractor: 'info',
    intern: 'default',
  };
  return variants[cat] || 'default';
};

export default function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{employee.name}</h3>
            <p className="text-sm text-gray-500">{employee.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant={getDepartmentVariant(employee.department)} size="sm">
                {employee.department}
              </Badge>
              <Badge variant={getJobTypeVariant(employee.jobType)} size="sm">
                {employee.jobType}
              </Badge>
              <Badge variant={getCategoryVariant(employee.category)} size="sm">
                {employee.category}
              </Badge>
            </div>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-gray-400 hover:text-primary-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-gray-400 hover:text-danger-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      {employee.skills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {employee.skills.map((skill) => (
              <span
                key={skill}
                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
