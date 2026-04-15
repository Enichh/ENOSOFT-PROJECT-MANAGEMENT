# Workstream: Frontend - UI Components & Pages

## Scope
Debug all React components, pages, and the routing system.

**Allowed to modify:**
- `src/pages/**/*`
- `src/components/**/*`
- `src/auth/ProtectedRoute.tsx`
- `src/router.tsx`
- `src/stores/*`

**Do NOT modify:**
- Core auth utilities (jwtUtils, authService, tokenStorage)
- Backend functions

## Critical Bugs (Must Fix)

### Bug 1: LoginPage.tsx - Wrong role source
**File**: `src/pages/login/LoginPage.tsx:22`
**Problem**: Reading `userRole` from `localStorage` instead of auth context
**Current Code**:
```typescript
await login(email, password);
const userRole = localStorage.getItem('userRole');  // WRONG!
```
**Fix**:
```typescript
const { login, user } = useAuth();
// ... after login
if (user?.role === 'admin') {
  navigate('/admin/dashboard');
}
```
**Acceptance Criteria**:
- [ ] Role is obtained from auth context, not localStorage
- [ ] Navigation works for both admin and employee
- [ ] No localStorage key 'userRole' referenced

## Verification Tasks

### Task 1: ProtectedRoute role checking
**File**: `src/auth/ProtectedRoute.tsx`
**Check**: 
- Role comparison logic at line 22
- Permission loading (lines 27-32)
- Error handling

### Task 2: Admin pages
**Files**: 
- `src/pages/admin/DashboardPage.tsx`
- `src/pages/admin/EmployeesPage.tsx`
- `src/pages/admin/ProjectsPage.tsx`
- `src/pages/admin/CalendarPage.tsx`
**Check**:
- Proper data fetching
- Error states
- Role-based access

### Task 3: Employee pages
**Files**:
- `src/pages/employee/DashboardPage.tsx`
- `src/pages/employee/TasksPage.tsx`
- `src/pages/employee/HistoryPage.tsx`
- `src/pages/employee/TeamPage.tsx`
**Check**:
- Proper data fetching
- Error states
- Role-based access

### Task 4: Router configuration
**File**: `src/router.tsx`
**Check**:
- Route guards
- Index redirects
- Layout nesting

### Task 5: Layout components
**Files**: `src/components/layout/*`
**Check**:
- Sidebar navigation
- Active state handling
- Role-based menu items

## MCP Server Usage
1. **context7** - React Router, React Query documentation
2. **filesystem** - Read and modify component files
3. **sequential-thinking** - Plan component fixes

## Output
Report back with JSON:
```json
{
  "ai_name": "[Choose from: Althea, Vianca, Princess, Aleah, Adjest, Lorraine]",
  "tasks_completed": ["task1", "task2"],
  "files_modified": ["path/to/file1", "path/to/file2"],
  "changes_summary": "Brief description",
  "blockers_or_issues": "Any issues or null",
  "next_steps": "Suggested next actions"
}
```
