import { Employee } from '../../types/models';

interface TeamMemberCardProps {
  employee: Employee;
  projectRole?: string;
}

export default function TeamMemberCard({ employee, projectRole }: TeamMemberCardProps) {
  const getDepartmentColor = (department: Employee['department']) => {
    switch (department) {
      case 'engineering':
        return 'bg-blue-100 text-blue-800';
      case 'design':
        return 'bg-purple-100 text-purple-800';
      case 'marketing':
        return 'bg-green-100 text-green-800';
      case 'sales':
        return 'bg-orange-100 text-orange-800';
      case 'hr':
        return 'bg-pink-100 text-pink-800';
      case 'operations':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobTypeColor = (jobType: Employee['jobType']) => {
    switch (jobType) {
      case 'remote':
        return 'bg-green-100 text-green-800';
      case 'onsite':
        return 'bg-blue-100 text-blue-800';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Employee['category']) => {
    switch (category) {
      case 'fullTime':
        return 'bg-blue-100 text-blue-800';
      case 'partTime':
        return 'bg-yellow-100 text-yellow-800';
      case 'contractor':
        return 'bg-orange-100 text-orange-800';
      case 'intern':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {getInitials(employee.name)}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {employee.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            {employee.email}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(employee.department)}`}>
              {employee.department.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobTypeColor(employee.jobType)}`}>
              {employee.jobType.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(employee.category)}`}>
              {employee.category.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          
          {projectRole && (
            <div className="mb-3">
              <span className="text-sm text-gray-500">Project Role: </span>
              <span className="text-sm font-medium text-gray-900">{projectRole}</span>
            </div>
          )}
          
          {employee.skills.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-1">Skills:</p>
              <div className="flex flex-wrap gap-1">
                {employee.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {employee.skills.length > 4 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                    +{employee.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center text-xs text-gray-500">
            <span>Joined {new Date(employee.joinDate).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            })}</span>
            {employee.isActive && (
              <span className="ml-2 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                Active
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}