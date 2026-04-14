# Workstream: Shared - Data Contracts & Types

**Status**: Must complete first | **Priority**: CRITICAL

## Goal
Define all TypeScript interfaces, types, and contracts that other workstreams depend on. This is the foundation for the entire project.

## Deliverables

### 1. Data Models (`src/types/models.ts`)
```typescript
// Employee model
interface Employee {
  id: string;
  name: string;
  email: string;
  department: 'engineering' | 'design' | 'marketing' | 'sales' | 'hr' | 'operations';
  jobType: 'remote' | 'onsite' | 'hybrid';
  category: 'fullTime' | 'partTime' | 'contractor' | 'intern';
  skills: string[];
  joinDate: string; // ISO date
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Project model
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'inProgress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  deadline: string;
  assignedEmployeeIds: string[];
  createdBy: string; // admin user id
  createdAt: string;
  updatedAt: string;
}

// Task model
interface Task {
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

// User/Auth model
interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'employee';
  employeeId: string | null; // null for admin-only accounts
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Calendar Event model
interface CalendarEvent {
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

// AI Chat Message
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// AI Recommendation
interface EmployeeRecommendation {
  employeeId: string;
  employeeName: string;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
  skillMatch: string[];
}
```

### 2. API Types (`src/types/api.ts`)
Define request/response types for all API endpoints:
- Auth endpoints (login, logout, me)
- Employee endpoints (create, read, update, delete, list, search)
- Project endpoints (create, read, update, delete, list, assign)
- Task endpoints (create, read, update, delete, list, complete)
- Calendar endpoints (create, read, update, delete, list)
- AI endpoints (chat, recommend)

### 3. Constants (`src/types/constants.ts`)
```typescript
export const DEPARTMENTS = ['engineering', 'design', 'marketing', 'sales', 'hr', 'operations'] as const;
export const JOB_TYPES = ['remote', 'onsite', 'hybrid'] as const;
export const CATEGORIES = ['fullTime', 'partTime', 'contractor', 'intern'] as const;
export const PROJECT_STATUSES = ['planning', 'inProgress', 'review', 'completed', 'cancelled'] as const;
export const TASK_STATUSES = ['todo', 'inProgress', 'review', 'completed'] as const;
export const ROLES = ['admin', 'employee'] as const;
```

### 4. Permission Map (`src/types/permissions.ts`)
```typescript
export const PERMISSIONS = {
  admin: ['*'],
  employee: [
    'task:read:own',
    'task:update:own',
    'project:read:assigned',
    'employee:read:projectMembers'
  ]
} as const;
```

### 5. AI Prompt Templates (`src/types/aiPrompts.ts`)
```typescript
export const EMPLOYEE_RECOMMENDATION_PROMPT = `You are an expert HR assistant...`;
export const CHAT_SYSTEM_PROMPT = `You are a helpful project management assistant...`;
```

## Acceptance Criteria
- [ ] All interfaces use camelCase
- [ ] No `any` types used
- [ ] All enums use const assertion for type safety
- [ ] Exports are organized and documented
- [ ] Types are validated by other workstreams

## Notes for Other Workstreams
- Backend: Use these models for data storage structure
- Frontend: Use these for component props and state
- Auth: User and role types defined here
