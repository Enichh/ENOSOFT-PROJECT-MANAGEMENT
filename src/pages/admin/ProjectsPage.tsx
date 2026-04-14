import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { Project, Employee } from '../../types/models';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import ProjectForm from '../../components/projects/ProjectForm';
import ProjectDetail from '../../components/projects/ProjectDetail';

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get<Project[]>('/projects'),
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => api.get<Employee[]>('/employees'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const handleAddProject = () => {
    setSelectedProject(undefined);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewDetail = (project: Project) => {
    setSelectedProject(project);
    setShowDetail(true);
  };

  const handleSubmitProject = async (data: any) => {
    if (selectedProject) {
      await api.put(`/projects/${selectedProject.id}`, data);
    } else {
      await api.post('/projects', data);
    }
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  const handleGetRecommendation = async () => {
    if (!selectedProject) return;
    try {
      await api.post(`/projects/${selectedProject.id}/assign`, {});
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      console.error('Failed to get recommendation:', error);
    }
  };

  const columns = [
    { key: 'name' as const, label: 'Name' },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: unknown) => (
        <span className="capitalize">{String(value).replace(/([A-Z])/g, ' $1').trim()}</span>
      ),
    },
    {
      key: 'priority' as const,
      label: 'Priority',
      render: (value: unknown) => (
        <span className="capitalize">{String(value)}</span>
      ),
    },
    {
      key: 'deadline' as const,
      label: 'Deadline',
      render: (value: unknown) => {
        const date = String(value);
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      },
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (_: unknown, row: Record<string, unknown>) => {
        const project = row as unknown as Project;
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => handleViewDetail(project)}>
              View
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleEditProject(project)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDeleteProject(project.id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  if (showDetail && selectedProject) {
    const assignedEmployees = employees.filter((emp) =>
      selectedProject.assignedEmployeeIds.includes(emp.id)
    );

    return (
      <div>
        <Button variant="ghost" onClick={() => setShowDetail(false)} className="mb-6">
          ← Back to Projects
        </Button>
        <ProjectDetail
          project={selectedProject}
          assignedEmployees={assignedEmployees}
          onEdit={() => {
            setShowDetail(false);
            handleEditProject(selectedProject);
          }}
          onDelete={() => handleDeleteProject(selectedProject.id)}
          onGetRecommendation={handleGetRecommendation}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button onClick={handleAddProject}>Create Project</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="inProgress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          data={filteredProjects as unknown as Record<string, unknown>[]}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No projects found"
        />
      </div>

      <ProjectForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProject}
        project={selectedProject}
      />
    </div>
  );
}
