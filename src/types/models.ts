export interface Employee {
  id: string;
  name: string;
  email: string;
  department: 'engineering' | 'design' | 'marketing' | 'sales' | 'hr' | 'operations';
  jobType: 'remote' | 'onsite' | 'hybrid';
  category: 'fullTime' | 'partTime' | 'contractor' | 'intern';
  skills: string[];
  joinDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'inProgress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  deadline: string;
  assignedEmployeeIds: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  employeeId: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'employee';
  employeeId: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  projectId: string;
  employeeIds: string[];
  title: string;
  startDate: string;
  endDate: string;
  type: 'deadline' | 'milestone' | 'meeting' | 'task';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface EmployeeRecommendation {
  employeeId: string;
  employeeName: string;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
  skillMatch: string[];
}
