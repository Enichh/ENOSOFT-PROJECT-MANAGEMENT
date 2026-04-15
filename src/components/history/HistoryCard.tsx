import { Project } from '../../types/models';

interface HistoryCardProps {
  project: Project;
  stats: {
    tasksCompleted: number;
    totalTasks: number;
    completionDate: string;
  };
}

export default function HistoryCard({ project, stats }: HistoryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCompletionPercentage = () => {
    if (stats.totalTasks === 0) return 0;
    return Math.round((stats.tasksCompleted / stats.totalTasks) * 100);
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{project.description}</p>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Completed
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Date Range:</span>
          <span className="text-gray-900 font-medium">
            {formatDate(project.startDate)} - {formatDate(project.deadline)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Completed:</span>
          <span className="text-gray-900 font-medium">
            {formatDate(stats.completionDate)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Tasks Completed:</span>
          <span className="text-gray-900 font-medium">
            {stats.tasksCompleted} of {stats.totalTasks}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500">Completion Rate:</span>
            <span className="text-gray-900 font-medium">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}