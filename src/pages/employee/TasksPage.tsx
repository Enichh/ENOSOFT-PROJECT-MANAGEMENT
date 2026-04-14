import React, { useState, useEffect } from 'react';
import { Task } from '../../types/models';
import { api } from '../../lib/apiClient';
import { useToast } from '../ui/Toast';
import TaskCard from '../tasks/TaskCard';
import TaskDetailModal from '../tasks/TaskDetailModal';
import ConfirmDialog from '../ui/ConfirmDialog';

type TaskStatus = Task['status'] | 'all';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<TaskStatus>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status'>('dueDate');
  const { showToast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, activeFilter, sortBy]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get<Task[]>('/api/tasks');
      setTasks(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showToast('Error loading tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTasks = () => {
    let filtered = tasks;

    if (activeFilter !== 'all') {
      filtered = tasks.filter(task => task.status === activeFilter);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          const statusOrder = { todo: 1, inProgress: 2, review: 3, completed: 4 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    setFilteredTasks(sorted);
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCompleteTask = (taskId: string) => {
    setTaskToComplete(taskId);
    setIsConfirmDialogOpen(true);
  };

  const confirmCompleteTask = async () => {
    if (!taskToComplete) return;

    try {
      const task = tasks.find(t => t.id === taskToComplete);
      if (!task) return;

      const originalTask = { ...task };
      
      setTasks(prev => prev.map(t => 
        t.id === taskToComplete 
          ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
          : t
      ));

      setIsConfirmDialogOpen(false);
      setTaskToComplete(null);
      
      showToast('Task completed successfully!', 'success');

      await api.put(`/api/tasks/${taskToComplete}/complete`, {});
    } catch (error) {
      console.error('Error completing task:', error);
      
      setTasks(prev => prev.map(t => 
        t.id === taskToComplete ? originalTask : t
      ));
      
      showToast('Error completing task', 'error');
    }
  };

  const getStatusCount = (status: TaskStatus) => {
    if (status === 'all') return tasks.length;
    return tasks.filter(task => task.status === status).length;
  };

  const filters: { value: TaskStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'To Do' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">My Tasks</h1>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'status')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`
              px-4 py-2 rounded-md font-medium transition-colors
              ${activeFilter === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {filter.label}
            <span className="ml-2 text-sm">
              ({getStatusCount(filter.value)})
            </span>
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">
            {activeFilter === 'all' 
              ? 'No tasks assigned to you' 
              : `No ${activeFilter.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} tasks`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleCompleteTask}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Complete Task"
        message="Are you sure you want to mark this task as complete?"
        confirmText="Complete"
        cancelText="Cancel"
        onConfirm={confirmCompleteTask}
        onCancel={() => {
          setIsConfirmDialogOpen(false);
          setTaskToComplete(null);
        }}
      />
    </div>
  );
}