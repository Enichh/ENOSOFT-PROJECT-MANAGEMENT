import { Employee, Project, Task, User, CalendarEvent, EmployeeRecommendation } from './models';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  department: Employee['department'];
  jobType: Employee['jobType'];
  category: Employee['category'];
  skills: string[];
  joinDate: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  department?: Employee['department'];
  jobType?: Employee['jobType'];
  category?: Employee['category'];
  skills?: string[];
  isActive?: boolean;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  deadline: string;
  assignedEmployeeIds: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: Project['status'];
  priority?: Project['priority'];
  startDate?: string;
  deadline?: string;
  assignedEmployeeIds?: string[];
}

export interface CreateTaskRequest {
  projectId: string;
  employeeId: string;
  title: string;
  description: string;
  dueDate: string;
  priority?: Task['priority'];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  dueDate?: string;
  completedAt?: string | null;
}

export interface CreateCalendarEventRequest {
  projectId: string;
  employeeIds: string[];
  title: string;
  startDate: string;
  endDate: string;
  type: CalendarEvent['type'];
  description: string;
}

export interface UpdateCalendarEventRequest {
  title?: string;
  startDate?: string;
  endDate?: string;
  type?: CalendarEvent['type'];
  description?: string;
  employeeIds?: string[];
}

export interface ChatRequest {
  message: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ChatResponse {
  response: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface RecommendRequest {
  projectId: string;
  requiredSkills: string[];
  description: string;
}

export interface RecommendResponse {
  recommendations: EmployeeRecommendation[];
}
