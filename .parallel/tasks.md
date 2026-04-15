# Master Debug Task List

## Shared Workstream - Authentication Core

### Tasks
1. [ ] **P0** Fix `jwtUtils.ts` - Remove Node.js `jsonwebtoken` dependency for browser
   - **Issue**: `jsonwebtoken` is a Node.js library, won't work in browser
   - **Files**: `src/auth/jwtUtils.ts`
   - **Fix**: Use `jwt-decode` for client-side decoding, or remove verification (should be server-side)
   
2. [ ] **P0** Fix `authService.ts` environment variable
   - **Issue**: `process.env.API_BASE_URL` doesn't work in Vite
   - **Files**: `src/auth/authService.ts:3`
   - **Fix**: Change to `import.meta.env.VITE_API_URL` to match `.env` file

3. [ ] **P1** Verify `tokenStorage.ts` error handling
   - **Files**: `src/auth/tokenStorage.ts`
   - **Check**: SSR safety, localStorage errors

4. [ ] **P1** Verify `AuthContext.tsx` initialization flow
   - **Files**: `src/auth/AuthContext.tsx`
   - **Check**: Race conditions, error handling, token refresh

## Frontend Workstream - UI Components & Pages

### Tasks
1. [ ] **P0** Fix `LoginPage.tsx` role retrieval
   - **Issue**: Line 22 reads `userRole` from localStorage, should use `user.role` from context
   - **Files**: `src/pages/login/LoginPage.tsx`
   - **Fix**: Get role from `useAuth()` context after login

2. [ ] **P1** Verify `ProtectedRoute.tsx` role checking
   - **Files**: `src/auth/ProtectedRoute.tsx`
   - **Check**: Permission imports, role comparison logic

3. [ ] **P1** Check all admin pages for auth requirements
   - **Files**: `src/pages/admin/*`
   - **Check**: Proper ProtectedRoute usage, role validation

4. [ ] **P1** Check all employee pages for auth requirements
   - **Files**: `src/pages/employee/*`
   - **Check**: Proper ProtectedRoute usage, role validation

5. [ ] **P2** Verify router configuration
   - **Files**: `src/router.tsx`
   - **Check**: Route guards, redirects, index routes

6. [ ] **P2** Check layout components
   - **Files**: `src/components/layout/*`
   - **Check**: Auth state access, navigation based on role

## Backend Workstream - Netlify Functions

### Tasks
1. [ ] **P0** Debug auth function
   - **Files**: `netlify/functions/auth/*`
   - **Check**: Login, logout, token refresh, current user endpoints
   - **Check**: JWT signing/verification, password hashing

2. [ ] **P1** Debug employees function
   - **Files**: `netlify/functions/employees/*`
   - **Check**: CRUD operations, data validation

3. [ ] **P1** Debug projects function
   - **Files**: `netlify/functions/projects/*`
   - **Check**: CRUD operations, employee assignments

4. [ ] **P1** Debug tasks function
   - **Files**: `netlify/functions/tasks/*`
   - **Check**: CRUD operations, status updates

5. [ ] **P2** Debug calendar function
   - **Files**: `netlify/functions/calendar/*`
   - **Check**: Event CRUD, date handling

6. [ ] **P2** Debug AI function
   - **Files**: `netlify/functions/ai/*`
   - **Check**: OpenAI integration, error handling

## Integration Workstream - Stores & Types

### Tasks
1. [ ] **P1** Verify all store implementations
   - **Files**: `src/stores/*`
   - **Check**: Zustand usage, persistence, state updates

2. [ ] **P1** Check type definitions
   - **Files**: `src/types/*`
   - **Check**: Model consistency, API types, permission types

3. [ ] **P2** Verify `apiClient.ts`
   - **Files**: `src/lib/apiClient.ts`
   - **Check**: Error handling, request/response interceptors

## Bug Tracking Log

| # | Severity | Location | Description | Status |
|---|----------|----------|-------------|--------|
| 1 | P0 | `src/pages/login/LoginPage.tsx:22` | Reading userRole from localStorage | Pending |
| 2 | P0 | `src/auth/authService.ts:3` | Wrong env var style for Vite | Pending |
| 3 | P0 | `src/auth/jwtUtils.ts` | Node.js library in browser | Pending |
