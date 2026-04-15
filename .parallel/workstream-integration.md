# Workstream: Integration - Stores & Types

## Scope
Debug Zustand stores, type definitions, and API client integration.

**Allowed to modify:**
- `src/stores/*`
- `src/types/*`
- `src/lib/apiClient.ts`
- `src/main.tsx`

**Do NOT modify:**
- Components (Frontend workstream)
- Backend functions (Backend workstream)
- Core auth (Shared workstream)

## Verification Tasks

### Task 1: Store Implementations
**Files**:
- `src/stores/authStore.ts`
- `src/stores/chatStore.ts`
- `src/stores/recommendationsStore.ts`
- `src/stores/uiStore.ts`

**Check**:
- [ ] Zustand store pattern correct
- [ ] State updates immutable
- [ ] No circular dependencies
- [ ] Persistence if needed
- [ ] DevTools integration

### Task 2: Type Definitions
**Files**:
- `src/types/models.ts`
- `src/types/api.ts`
- `src/types/permissions.ts`
- `src/types/constants.ts`
- `src/types/aiPrompts.ts`

**Check**:
- [ ] All models defined
- [ ] API request/response types
- [ ] Permission constants correct
- [ ] No type conflicts with backend

### Task 3: API Client
**File**: `src/lib/apiClient.ts`
**Check**:
- [ ] Axios or fetch setup
- [ ] Error interceptors
- [ ] Auth header injection
- [ ] Base URL configuration
- [ ] Retry logic

### Task 4: Main Entry Point
**File**: `src/main.tsx`
**Check**:
- [ ] React 18 createRoot
- [ ] QueryClient configuration
- [ ] AuthProvider wrapping
- [ ] Router setup
- [ ] CSS imports

### Task 5: Dependencies
**File**: `package.json`
**Check**:
- [ ] All required packages installed
- [ ] No duplicate/conflicting versions
- [ ] Dev vs prod dependencies correct
- [ ] Scripts work (dev, build, preview)

## MCP Server Usage
1. **context7** - Zustand, React Query documentation
2. **filesystem** - Read store and type files
3. **sequential-thinking** - Plan integration fixes

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
