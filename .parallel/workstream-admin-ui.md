# Workstream: Admin-UI - Admin Dashboard & CRUD

**Status**: Can start after Frontend-Core, Backend | **Priority**: Medium
**Dependencies**: Frontend-Core, Backend

## Goal
Implement all admin-facing UI components for employee/project management and calendar editing.

## Deliverables

### 1. Admin Dashboard (`src/pages/admin/DashboardPage.tsx`)
```typescript
// Show summary cards:
// - Total employees
// - Active projects
// - Projects due this week
// - Recent AI recommendations
```

### 2. Employee Management

#### Employee Repository Page (`src/pages/admin/EmployeesPage.tsx`)
```typescript
// Features:
// - Data table with columns: Name, Department, Job Type, Category, Actions
// - Search bar (global text search)
// - Filter dropdowns:
//   - Department (engineering, design, etc.)
//   - Job Type (remote, onsite, hybrid)
//   - Category (fullTime, partTime, etc.)
// - Add Employee button → opens modal
// - Edit/Delete actions per row
```

#### Employee Form Modal (`src/components/employees/EmployeeModal.tsx`)
```typescript
interface EmployeeFormData {
  name: string;
  email: string;
  department: Department;
  jobType: JobType;
  category: Category;
  skills: string[]; // Tag input
}

// Validation:
// - Email format
// - Required fields
// - Unique email check
```

#### Employee Card (`src/components/employees/EmployeeCard.tsx`)
```typescript
// Display:
// - Avatar placeholder
// - Name, Email
// - Department badge
// - Job type badge
// - Category badge
// - Skills tags
```

### 3. Project Management

#### Projects Page (`src/pages/admin/ProjectsPage.tsx`)
```typescript
// Features:
// - Project cards or table view
// - Status filters (planning, inProgress, etc.)
// - Priority indicators
// - Quick actions: Edit, Delete, View Details
// - Create Project button
```

#### Project Form (`src/components/projects/ProjectForm.tsx`)
```typescript
interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  deadline: string;
}
```

#### Project Detail View (`src/components/projects/ProjectDetail.tsx`)
```typescript
// Sections:
// - Project info (name, description, dates, status)
// - Assigned employees list
// - Task summary
// - AI Recommendation button
```

### 4. Employee Assignment UI

#### Assignment Interface (`src/components/assignments/AssignmentPanel.tsx`)
```typescript
// Features:
// - Left panel: Available employees (with filters)
// - Right panel: Currently assigned
// - Drag-and-drop or click-to-assign
// - AI Recommendation button:
//   - Calls /api/ai/recommend
//   - Shows loading state
//   - Displays top 3 recommended employees
//   - One-click "Assign Recommended"
```

#### Recommendation Display (`src/components/assignments/RecommendationCard.tsx`)
```typescript
interface Props {
  recommendation: EmployeeRecommendation;
  onAccept: () => void;
}

// Display:
// - Employee name
// - Confidence badge (high/medium/low)
// - Reasoning text
// - Matched skills
// - Accept button
```

### 5. Admin Calendar

#### Calendar Page (`src/pages/admin/CalendarPage.tsx`)
```typescript
// FullCalendar integration
// Views: Month, Week, Day

// Features:
// - Show project deadlines as events
// - Show employee assignments
// - Color-code by project status
// - Click to edit/create event
// - Drag to reschedule
```

#### Event Modal (`src/components/calendar/EventModal.tsx`)
```typescript
interface EventFormData {
  title: string;
  projectId: string; // Dropdown
  employeeIds: string[]; // Multi-select
  startDate: string;
  endDate: string;
  type: EventType;
  description: string;
}
```

### 6. Account Creation

#### Create Employee Account (`src/components/admin/CreateAccountForm.tsx`)
```typescript
// Form fields:
// - Select existing employee (dropdown)
// - Email (auto-fill from employee)
// - Temporary password
// - Role (default: employee)

// On submit:
// - POST to /api/auth/create-account
// - Show success with credentials
```

## Acceptance Criteria
- [ ] Employee CRUD fully functional
- [ ] Search and filters work correctly
- [ ] Project CRUD fully functional
- [ ] Assignment UI updates in real-time
- [ ] AI recommendation displays with reasoning
- [ ] Calendar shows all project deadlines
- [ ] Calendar events can be created/edited
- [ ] Account creation sends credentials

## API Dependencies
- GET /api/employees
- POST /api/employees
- PUT /api/employees/:id
- DELETE /api/employees/:id
- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id
- POST /api/projects/:id/assign
- POST /api/ai/recommend
- GET /api/calendar
- POST /api/calendar

## Notes
- Use context7 MCP for FullCalendar documentation
- Implement optimistic updates for better UX
- Show toast notifications for success/error
- All forms have validation feedback
