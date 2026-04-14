import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { Project, Task, Employee } from '../../types/models';
import CreateAccountForm from '../../components/admin/CreateAccountForm';

export default function AdminDashboardPage() {
  const { data: employees = [], isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => api.get<Employee[]>('/employees'),
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get<Project[]>('/projects'),
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => api.get<Task[]>('/tasks'),
  });

  const activeProjects = projects.filter((p) => p.status === 'inProgress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'todo').length;

  const today = new Date();
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingDeadlines = projects.filter(
    (p) => new Date(p.deadline) >= today && new Date(p.deadline) <= weekFromNow
  ).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-gray-900">
            {employeesLoading ? '-' : employees.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Active Projects</h3>
          <p className="text-3xl font-bold text-gray-900">
            {projectsLoading ? '-' : activeProjects}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Tasks</h3>
          <p className="text-3xl font-bold text-gray-900">
            {tasksLoading ? '-' : pendingTasks}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Projects Due This Week</h3>
          <p className="text-3xl font-bold text-gray-900">
            {projectsLoading ? '-' : upcomingDeadlines}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
          {projectsLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-500">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.status}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.priority === 'critical' ? 'bg-danger-100 text-danger-800' :
                    project.priority === 'high' ? 'bg-warning-100 text-warning-800' :
                    project.priority === 'medium' ? 'bg-info-100 text-info-800' :
                    'bg-success-100 text-success-800'
                  }`}>
                    {project.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <CreateAccountForm />
      </div>
    </div>
  );
}
