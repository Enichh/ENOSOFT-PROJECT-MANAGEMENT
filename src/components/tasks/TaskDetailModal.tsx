import { Task } from '../../types/models';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (taskId: string) => void;
}

export default function TaskDetailModal({ task, isOpen, onClose, onComplete }: TaskDetailModalProps) {
  if (!isOpen || !task) return null;

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-700';
      case 'inProgress':
        return 'bg-blue-100 text-blue-700';
      case 'review':
        return 'bg-purple-100 text-purple-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = () => {
    if (task.status === 'completed' || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  const handleComplete = () => {
    onComplete(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
              Priority: {task.priority}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status)}`}>
              Status: {task.status.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || 'No description provided'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Project</h3>
                <p className="text-gray-700">{task.projectId}</p>
              </div>

              {task.dueDate && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Due Date</h3>
                  <p className={`font-medium ${
                    isOverdue() ? 'text-red-600' : 'text-gray-700'
                  }`}>
                    {formatDate(task.dueDate)}
                    {isOverdue() && (
                      <span className="ml-2 text-sm text-red-600 font-medium"> (Overdue)</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Created</h3>
                <p className="text-gray-700">{formatDate(task.createdAt)}</p>
              </div>

              {task.completedAt && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
                  <p className="text-gray-700">{formatDate(task.completedAt)}</p>
                </div>
              )}
            </div>

            {task.updatedAt && task.updatedAt !== task.createdAt && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Updated</h3>
                <p className="text-gray-700">{formatDate(task.updatedAt)}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
            {task.status !== 'completed' && (
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Mark as Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}