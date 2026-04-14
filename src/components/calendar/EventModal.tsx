import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { CalendarEvent, Project, Employee } from '../../types/models';

interface EventFormData {
  title: string;
  projectId: string;
  employeeIds: string[];
  startDate: string;
  endDate: string;
  type: 'deadline' | 'milestone' | 'meeting' | 'task';
  description: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
  event?: CalendarEvent;
  projects: Project[];
  employees: Employee[];
  selectedDate?: string | null;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export default function EventModal({
  isOpen,
  onClose,
  onSubmit,
  event,
  projects,
  employees,
  selectedDate,
  onDelete,
  isLoading = false,
}: EventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    projectId: '',
    employeeIds: [],
    startDate: '',
    endDate: '',
    type: 'task',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        projectId: event.projectId,
        employeeIds: event.employeeIds,
        startDate: event.startDate.split('T')[0],
        endDate: event.endDate.split('T')[0],
        type: event.type,
        description: event.description,
      });
    } else if (selectedDate) {
      setFormData({
        title: '',
        projectId: '',
        employeeIds: [],
        startDate: selectedDate,
        endDate: selectedDate,
        type: 'task',
        description: '',
      });
    } else {
      setFormData({
        title: '',
        projectId: '',
        employeeIds: [],
        startDate: '',
        endDate: '',
        type: 'task',
        description: '',
      });
    }
    setErrors({});
  }, [event, selectedDate, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit event:', error);
    }
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setFormData({
      ...formData,
      employeeIds: formData.employeeIds.includes(employeeId)
        ? formData.employeeIds.filter((id) => id !== employeeId)
        : [...formData.employeeIds, employeeId],
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'Create Event'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
          <select
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.projectId ? 'border-danger-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId && <p className="mt-1 text-sm text-danger-600">{errors.projectId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="task">Task</option>
            <option value="deadline">Deadline</option>
            <option value="milestone">Milestone</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            error={errors.startDate}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            error={errors.endDate}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Employees</label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2">
            {employees.length === 0 ? (
              <p className="text-gray-500 text-sm">No employees available</p>
            ) : (
              employees.map((employee) => (
                <label key={employee.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.employeeIds.includes(employee.id)}
                    onChange={() => toggleEmployeeSelection(employee.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{employee.name}</span>
                  <span className="text-xs text-gray-500">({employee.department})</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex justify-between gap-2 pt-4">
          {event && onDelete && (
            <Button type="button" variant="danger" onClick={() => onDelete(event.id)}>
              Delete
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {event ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
