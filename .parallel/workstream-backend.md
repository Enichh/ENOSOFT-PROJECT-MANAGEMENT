# Workstream: Backend - Netlify Functions

## Scope
Debug all server-side Netlify functions for API endpoints.

**Allowed to modify:**
- `netlify/functions/auth/*`
- `netlify/functions/employees/*`
- `netlify/functions/projects/*`
- `netlify/functions/tasks/*`
- `netlify/functions/calendar/*`
- `netlify/functions/ai/*`
- `netlify/functions/lib/*`

**Do NOT modify:**
- Frontend code
- Auth utilities (handled by Shared workstream)

## Critical Bugs to Check

### Task 1: Auth Function
**Location**: `netlify/functions/auth/`
**Check**:
- [ ] Login endpoint validates credentials
- [ ] JWT signing uses proper secret
- [ ] Password hashing with bcrypt
- [ ] Token expiration handling
- [ ] Logout endpoint clears session
- [ ] `/auth/me` returns current user

### Task 2: Employees Function
**Location**: `netlify/functions/employees/`
**Check**:
- [ ] GET /employees returns list
- [ ] POST /employees creates new
- [ ] PUT /employees/:id updates
- [ ] DELETE /employees/:id removes
- [ ] Proper error handling
- [ ] Input validation

### Task 3: Projects Function
**Location**: `netlify/functions/projects/`
**Check**:
- [ ] CRUD operations work
- [ ] Employee assignments
- [ ] Status transitions
- [ ] Date handling
- [ ] Authorization checks

### Task 4: Tasks Function
**Location**: `netlify/functions/tasks/`
**Check**:
- [ ] CRUD operations work
- [ ] Status updates
- [ ] Project/employee associations
- [ ] Due date handling
- [ ] Completion tracking

### Task 5: Calendar Function
**Location**: `netlify/functions/calendar/`
**Check**:
- [ ] Event CRUD
- [ ] Date range queries
- [ ] Employee event associations
- [ ] Event type filtering

### Task 6: AI Function
**Location**: `netlify/functions/ai/`
**Check**:
- [ ] OpenAI API integration
- [ ] Error handling for API failures
- [ ] Rate limiting
- [ ] Prompt formatting
- [ ] Response parsing

## Common Issues to Look For

1. **CORS headers** - Must be set for browser requests
2. **HTTP methods** - POST/GET/PUT/DELETE properly handled
3. **Status codes** - 200, 201, 400, 401, 404, 500 used correctly
4. **Error responses** - JSON error format consistent
5. **Data persistence** - Netlify Blobs or external DB

## MCP Server Usage
1. **context7** - Netlify Functions, OpenAI SDK documentation
2. **filesystem** - Read and modify function files
3. **deepwiki** - Check any GitHub repos for patterns
4. **sequential-thinking** - Plan backend architecture

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
