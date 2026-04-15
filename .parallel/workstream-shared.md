# Workstream: Shared - Authentication Core

## Scope
Fix core authentication utilities that the entire app depends on.

**Allowed to modify:**
- `src/auth/jwtUtils.ts`
- `src/auth/tokenStorage.ts`
- `src/auth/authService.ts`
- `src/auth/AuthContext.tsx`

**Do NOT modify:**
- Any UI components
- Backend functions
- Router configuration

## Critical Bugs (Must Fix)

### Bug 1: jwtUtils.ts - Node.js library in browser
**File**: `src/auth/jwtUtils.ts`
**Problem**: Using `jsonwebtoken` which is a Node.js library
**Current Code**:
```typescript
import jwt from 'jsonwebtoken';
```
**Fix Options**:
- Option A: Install `jwt-decode` for client-side decoding only (recommended)
- Option B: Remove JWT verification from client (server should verify)
- Option C: Store minimal user info in token, decode without verification

**Acceptance Criteria**:
- [ ] No Node.js-specific imports in browser code
- [ ] Token decoding works without errors
- [ ] JWT verification happens server-side only

### Bug 2: authService.ts - Wrong environment variable
**File**: `src/auth/authService.ts:3`
**Problem**: `process.env.API_BASE_URL` doesn't work in Vite
**Current Code**:
```typescript
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
```
**Fix**:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';
```
**Acceptance Criteria**:
- [ ] Uses correct Vite env syntax
- [ ] Falls back to Netlify functions path
- [ ] API calls work in dev and production

### Bug 3: Verify AuthContext initialization
**File**: `src/auth/AuthContext.tsx`
**Check**: 
- Does `initializeAuth()` handle all edge cases?
- Is token refresh working?
- Are errors properly caught?

## MCP Server Usage
1. **context7** - Check Vite environment variable documentation
2. **filesystem** - Read and modify auth files
3. **sequential-thinking** - Plan JWT handling strategy

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
