import { useState, useEffect } from 'react';
import { Project, Task } from '../../types/models';
import { api } from '../../lib/apiClient';
import { useToast } from '../../components/ui/Toast';
import HistoryCard from '../../components/history/HistoryCard';

interface ProjectStats {
  [projectId: string]: {
    tasksCompleted: number;
    totalTasks: number;
    completionDate: string;
  };
}

export default function HistoryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectStats>({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const [projectsResponse, tasksResponse] = await Promise.all([
        api.get<Project[]>('/api/projects'),
        api.get<Task[]>('/api/tasks')
      ]);
      
      const completedProjects = projectsResponse.filter(project => project.status === 'completed');
      const completedTasks = tasksResponse.filter(task => task.status === 'completed');
      
      setProjects(completedProjects);
      setTasks(completedTasks);
      
      const stats: ProjectStats = {};
      completedProjects.forEach(project => {
        const projectTasks = completedTasks.filter(task => task.projectId === project.id);
        const allProjectTasks = tasksResponse.filter(task => task.projectId === project.id);
        
        stats[project.id] = {
          tasksCompleted: projectTasks.length,
          totalTasks: allProjectTasks.length,
          completionDate: project.updatedAt
        };
      });
      
      setProjectStats(stats);
    } catch (error) {
      console.error('Error fetching history data:', error);
      showToast('Error loading project history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTotalStats = () => {
    const totalProjects = projects.length;
    const totalTasksCompleted = tasks.length;
    const totalTasksAssigned = Object.values(projectStats).reduce((sum, stats) => sum + stats.totalTasks, 0);
    const averageCompletionRate = totalTasksAssigned > 0 
      ? Math.round((totalTasksCompleted / totalTasksAssigned) * 100) 
      : 0;

    return {
      totalProjects,
      totalTasksCompleted,
      totalTasksAssigned,
      averageCompletionRate
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading project history...</div>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project History</h1>
        <p className="text-gray-600">Your completed projects and contributions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Completed Projects</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Tasks Completed</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalTasksCompleted}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Tasks Assigned</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalTasksAssigned}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Avg Completion Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.averageCompletionRate}%</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No completed projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map(project => (
              <HistoryCard
                key={project.id}
                project={project}
                stats={projectStats[project.id] || {
                  tasksCompleted: 0,
                  totalTasks: 0,
                  completionDate: project.updatedAt
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
}