import React, { useState, useEffect } from 'react';
import { Project, Employee } from '../../types/models';
import { api } from '../../lib/apiClient';
import { useToast } from '../ui/Toast';
import ProjectSelector from '../team/ProjectSelector';
import TeamMemberCard from '../team/TeamMemberCard';

export default function TeamPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTeamMembers(selectedProject);
    } else {
      setTeamMembers([]);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get<Project[]>('/api/projects');
      setProjects(response);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showToast('Error loading projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (projectId: string) => {
    try {
      setTeamLoading(true);
      const response = await api.get<Employee[]>(`/api/projects/${projectId}/employees`);
      setTeamMembers(response);
    } catch (error) {
      console.error('Error fetching team members:', error);
      showToast('Error loading team members', 'error');
      setTeamMembers([]);
    } finally {
      setTeamLoading(false);
    }
  };

  const handleProjectChange = (projectId: string | null) => {
    setSelectedProject(projectId);
  };

  const getProjectStats = () => {
    if (!selectedProject) return null;
    
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return null;

    return {
      totalMembers: teamMembers.length,
      activeMembers: teamMembers.filter(member => member.isActive).length,
      departments: [...new Set(teamMembers.map(member => member.department))].length
    };
  };

  const stats = getProjectStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Team</h1>
        <p className="text-gray-600">View team members for your projects</p>
      </div>

      <ProjectSelector
        projects={projects}
        selectedProject={selectedProject}
        onProjectChange={handleProjectChange}
        loading={loading}
      />

      {teamLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading team members...</div>
        </div>
      )}

      {!teamLoading && selectedProject && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Members</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Active Members</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Departments</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
          </div>
        </div>
      )}

      {!teamLoading && teamMembers.length === 0 && selectedProject && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No team members found for this project</p>
        </div>
      )}

      {!teamLoading && !selectedProject && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Select a project to view team members</p>
        </div>
      )}

      {!teamLoading && teamMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map(member => (
            <TeamMemberCard
              key={member.id}
              employee={member}
            />
          ))}
        </div>
      )}
    </div>
  );
}