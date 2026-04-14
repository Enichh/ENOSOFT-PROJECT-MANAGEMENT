# Master Task List - EnoSoft Project

## Phase 1: Foundation (Sequential)

### Workstream: Shared (CRITICAL - First)
**Priority**: Highest | **Dependencies**: None

- [ ] Define TypeScript interfaces for all data models
  - Employee (id, name, email, department, jobType, category, skills, createdAt)
  - Project (id, name, description, deadline, status, assignedEmployees, createdAt)
  - Task (id, projectId, employeeId, title, description, status, dueDate)
  - User (id, email, passwordHash, role, employeeId)
  - CalendarEvent (id, projectId, employeeIds, title, startDate, endDate, type)
- [ ] Define API response/request types
- [ ] Define role constants and permissions map
- [ ] Create validation schemas
- [ ] Define AI prompt templates for recommendations

---

### Workstream: Auth
**Priority**: High | **Dependencies**: Shared

- [ ] Implement JWT authentication utilities
- [ ] Create login/logout logic
- [ ] Build role-based access control (RBAC) hooks
- [ ] Create protected route components
- [ ] Implement password hashing (bcryptjs)
- [ ] Create auth context/provider

---

## Phase 2: Core Infrastructure (Parallel after Foundation)

### Workstream: Backend
**Priority**: High | **Dependencies**: Shared

- [ ] Set up Netlify functions structure
- [ ] Create data layer abstraction (Blob store wrapper)
- [ ] Implement employee CRUD functions
- [ ] Implement project CRUD functions
- [ ] Implement task CRUD functions
- [ ] Create AI recommendation function (OpenAI/Anthropic API)
- [ ] Create AI chat function with context management
- [ ] Implement search endpoints (category, department, jobType)
- [ ] Set up CORS and security headers
- [ ] Create error handling middleware

---

### Workstream: Frontend-Core
**Priority**: High | **Dependencies**: Shared, Auth

- [ ] Initialize React + TypeScript + Vite project
- [ ] Configure TailwindCSS
- [ ] Set up React Router with role-based routes
- [ ] Create global state management (Zustand/Context)
- [ ] Create API client layer with fetch/axios
- [ ] Build layout components (sidebar, header, footer)
- [ ] Create loading and error states
- [ ] Set up theme/styling system

---

## Phase 3: Feature Implementation (Parallel)

### Workstream: Admin-UI
**Priority**: Medium | **Dependencies**: Frontend-Core, Backend

- [ ] Create admin dashboard layout
- [ ] Build employee repository page
  - List view with filters (category, department, jobType)
  - Search functionality
  - Add/Edit employee modal
- [ ] Build project management page
  - Project list with CRUD
  - Project detail view
  - Task assignment interface
- [ ] Build employee assignment interface
  - Drag-and-drop or selection UI
  - Show available employees with filters
  - Show AI recommendation button
- [ ] Build admin calendar view
  - FullCalendar integration
  - Project deadline visualization
  - Employee assignment on calendar
  - Edit events capability
- [ ] Create employee account creation form

---

### Workstream: Employee-UI
**Priority**: Medium | **Dependencies**: Frontend-Core, Backend

- [ ] Create employee dashboard
- [ ] Build assigned tasks view
  - Task list with status
  - Mark as complete functionality
- [ ] Build project history page
  - Completed projects list
  - Project details and contributions
- [ ] Build team members view (project-specific)
  - Show colleagues on same projects
  - Read-only employee cards

---

### Workstream: AI-Features
**Priority**: Medium | **Dependencies**: Frontend-Core, Backend (AI functions)

- [ ] Create AI chat interface component
  - Chat UI with message history
  - Context-aware prompts for recommendations
- [ ] Implement recommendation button component
  - Loading states during AI processing
  - Display recommended employees with reasoning
  - One-click accept recommendation
- [ ] Create AI suggestion display component
- [ ] Build prompt engineering for employee matching
  - Send project requirements + employee profiles
  - Parse AI response into structured data

---

## Phase 4: Integration & Polish

- [ ] Connect all API endpoints
- [ ] Implement error handling and notifications
- [ ] Add loading states across all pages
- [ ] Test role-based access
- [ ] Deploy to Netlify
- [ ] Environment variable configuration

## Naming Conventions (Per Project Rules)
- camelCase for all variables, functions, classes, files
- Single responsibility per module/function
- Early returns and guard clauses
- Minimal comments for non-obvious logic
