# Workstream: Employee-UI - Employee Dashboard & Views

**Status**: Can start after Frontend-Core, Backend | **Priority**: Medium
**Dependencies**: Frontend-Core, Backend

## Goal
Implement all employee-facing UI components for task management and project visibility.

## Deliverables

### 1. Employee Dashboard (`src/pages/employee/DashboardPage.tsx`)
```typescript
// Layout:
// - Welcome header with employee name
// - Summary cards:
//   - Active tasks count
//   - Tasks due today
//   - Completed this week
// - Recent projects list (3 items)
// - Quick links to Tasks and History
```

### 2. Task Management

#### Tasks Page (`src/pages/employee/TasksPage.tsx`)
```typescript
// Features:
// - Tab filters: All | To Do | In Progress | Review | Completed
// - Task list with:
//   - Task title
//   - Project name
//   - Due date (highlight if overdue)
//   - Priority badge
//   - Status with visual indicator
// - Sort options: Due date, Priority, Status
```

#### Task Card (`src/components/tasks/TaskCard.tsx`)
```typescript
interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

// Visual elements:
// - Priority color coding (low=gray, medium=yellow, high=red)
// - Status icon/indicator
// - Due date with warning if < 24 hours
// - Complete button (disabled if already completed)
```

#### Task Detail Modal (`src/components/tasks/TaskDetailModal.tsx`)
```typescript
// Display:
// - Task full description
// - Project context
// - Due date
// - Status history (if available)
// - Complete button
// - Close button
```

#### Complete Task Flow
```typescript
// On complete button click:
// 1. Show confirmation dialog
// 2. PUT /api/tasks/:id/complete
// 3. Optimistically update UI
// 4. Show success toast
// 5. Move to completed section
```

### 3. Project History

#### History Page (`src/pages/employee/HistoryPage.tsx`)
```typescript
// Features:
// - Completed projects list
// - Participation summary (how many tasks completed)
// - Project duration
// - Team members preview
```

#### History Card (`src/components/history/HistoryCard.tsx`)
```typescript
interface HistoryCardProps {
  project: Project;
  stats: {
    tasksCompleted: number;
    totalTasks: number;
    completionDate: string;
  };
}

// Display:
// - Project name
// - Status badge (completed)
// - Date range
// - Tasks completed: X of Y
// - Team members avatars (first 3)
```

### 4. Team Members View

#### Team Page (`src/pages/employee/TeamPage.tsx`)
```typescript
// Features:
// - Project selector (dropdown of current projects)
// - Team members grid/list
// - Read-only employee cards
```

#### Team Member Card (`src/components/team/TeamMemberCard.tsx`)
```typescript
interface TeamMemberCardProps {
  employee: Employee;
  projectRole?: string;
}

// Display (read-only):
// - Avatar placeholder
// - Name
// - Department
// - Skills (view only)
// - Contact email (optional)
```

#### Project Selector (`src/components/team/ProjectSelector.tsx`)
```typescript
// Dropdown showing only projects assigned to current employee
// On change: fetch and display team members for selected project
```

### 5. Navigation

#### Employee Sidebar (`src/components/layout/EmployeeSidebar.tsx`)
```typescript
// Navigation items:
// - Dashboard (icon: home)
// - My Tasks (icon: checklist) with badge count
// - Project History (icon: history)
// - My Team (icon: users)
// - Logout (icon: logout)

// Active state styling
// Collapsible on mobile
```

### 6. Notifications/Toasts

#### Toast System (`src/components/ui/Toast.tsx`)
```typescript
// For employee actions:
// - Task completed successfully
// - Error loading data
// - New task assigned (future enhancement)
```

## Acceptance Criteria
- [ ] Employee sees only their assigned tasks
- [ ] Tasks can be marked complete with confirmation
- [ ] Completed tasks show in history
- [ ] Project history shows accurate participation
- [ ] Team view shows only project-specific members
- [ ] Due dates are highlighted appropriately
- [ ] Priority badges are color-coded
- [ ] Mobile responsive layout

## API Dependencies
- GET /api/auth/me (current user)
- GET /api/tasks?employeeId=current (employee's tasks)
- PUT /api/tasks/:id/complete
- GET /api/projects?employeeId=current (employee's projects)
- GET /api/projects/:id/employees (team members)

## Security Considerations
- Only fetch data for current logged-in employee
- Verify employee ID matches on all requests
- No ability to see other employees' tasks
- Read-only access to team member profiles

## Notes
- Use optimistic updates for task completion
- Implement pull-to-refresh for mobile
- Cache project data to reduce API calls
- All components use camelCase naming
