import React from 'react';
import { Task } from '../../types/models';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onViewDetails: (task: Task) => void;
}

export default function TaskCard({ task, onComplete, onViewDetails }: TaskCardProps) {
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

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'circle';
      case 'inProgress':
        return 'clock';
      case 'review':
        return 'eye';
      case 'completed':
        return 'check-circle';
      default:
        return 'circle';
    }
  };

  const isOverdue = () => {
    if (task.status === 'completed' || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  const isDueSoon = () => {
    if (task.status === 'completed' || !task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDue <= 24 && hoursUntilDue > 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 
            className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
            onClick={() => onViewDetails(task)}
          >
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Project: {task.projectId}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
            <span className="inline-block w-3 h-3 mr-1">{getStatusIcon(task.status)}</span>
            {task.status.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        </div>
      </div>

      {task.dueDate && (
        <div className="flex items-center text-sm mb-3">
          <span className="text-gray-500">Due: </span>
          <span className={`ml-1 font-medium ${
            isOverdue() ? 'text-red-600' : isDueSoon() ? 'text-yellow-600' : 'text-gray-700'
          }`}>
            {formatDate(task.dueDate)}
          </span>
          {isOverdue() && (
            <span className="ml-2 text-xs text-red-600 font-medium">Overdue</span>
          )}
          {isDueSoon() && !isOverdue() && (
            <span className="ml-2 text-xs text-yellow-600 font-medium">Due Soon</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => onViewDetails(task)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </button>
        {task.status !== 'completed' && (
          <button
            onClick={() => onComplete(task.id)}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
}