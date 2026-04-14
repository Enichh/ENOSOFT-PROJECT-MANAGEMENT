import React from 'react';
import { Project } from '../../types/models';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: string | null;
  onProjectChange: (projectId: string | null) => void;
  loading?: boolean;
}

export default function ProjectSelector({ 
  projects, 
  selectedProject, 
  onProjectChange, 
  loading = false 
}: ProjectSelectorProps) {
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
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeProjects = projects.filter(project => 
    project.status !== 'cancelled' && project.status !== 'completed'
  );

  if (loading) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Project
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
          <span className="text-gray-500">Loading projects...</span>
        </div>
      </div>
    );
  }

  if (activeProjects.length === 0) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Project
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
          <span className="text-gray-500">No active projects available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Project
      </label>
      <select
        value={selectedProject || ''}
        onChange={(e) => onProjectChange(e.target.value || null)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Projects</option>
        {activeProjects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      {selectedProject && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {(() => {
            const project = projects.find(p => p.id === selectedProject);
            if (!project) return null;
            
            return (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1 mt-1">{project.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}