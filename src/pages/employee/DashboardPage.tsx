import { useState, useEffect } from 'react';
import { Task, Project } from '../../types/models';
import { api } from '../../lib/apiClient';
import { useToast } from '../../components/ui/Toast';

export default function EmployeeDashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, projectsResponse] = await Promise.all([
        api.get<Task[]>('/api/tasks'),
        api.get<Project[]>('/api/projects')
      ]);
      
      setTasks(tasksResponse);
      setProjects(projectsResponse);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTaskStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const activeTasks = tasks.filter(task => task.status !== 'completed');
    const tasksDueToday = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });
    const completedThisWeek = tasks.filter(task => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate >= weekStart;
    });

    return {
      activeTasks: activeTasks.length,
      tasksDueToday: tasksDueToday.length,
      completedThisWeek: completedThisWeek.length
    };
  };

  const getRecentProjects = () => {
    return projects
      .filter(project => project.status !== 'cancelled')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-gray-100 text-gray-800';
      case 'inProgress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const stats = getTaskStats();
  const recentProjects = getRecentProjects();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Here's an overview of your work</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm font-medium">Active Tasks</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">!</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeTasks}</p>
          <p className="text-sm text-gray-600 mt-1">Tasks in progress</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm font-medium">Due Today</h3>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm">!</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.tasksDueToday}</p>
          <p className="text-sm text-gray-600 mt-1">Tasks due today</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm font-medium">Completed This Week</h3>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">!</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.completedThisWeek}</p>
          <p className="text-sm text-gray-600 mt-1">Tasks completed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <a href="/employee/history" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </a>
            </div>
            
            {recentProjects.length === 0 ? (
              <p className="text-gray-500">No projects assigned</p>
            ) : (
              <div className="space-y-3">
                {recentProjects.map(project => (
                  <div key={project.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(project.deadline)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-3">
              <a
                href="/employee/tasks"
                className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">My Tasks</h4>
                  <p className="text-sm text-gray-500">View and manage your tasks</p>
                </div>
              </a>

              <a
                href="/employee/history"
                className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Project History</h4>
                  <p className="text-sm text-gray-500">View completed projects</p>
                </div>
              </a>

              <a
                href="/employee/team"
                className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">My Team</h4>
                  <p className="text-sm text-gray-500">View team members</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}