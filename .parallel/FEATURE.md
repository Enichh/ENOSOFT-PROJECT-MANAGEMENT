# Comprehensive Codebase Debug

## Feature Overview
Full debugging sweep of the EnoSoft project management system codebase, covering authentication, frontend UI, backend APIs, and integration points.

## Known Issues Found
1. **LoginPage.tsx**: Reading `userRole` from `localStorage` instead of using `user.role` from auth context
2. **authService.ts**: Using `process.env.API_BASE_URL` (Node.js style) instead of `import.meta.env.VITE_API_URL` (Vite style)
3. **jwtUtils.ts**: Using Node.js `jsonwebtoken` library in browser code, plus `process.env` won't work in Vite

## Coordination Rules
- **Shared workstream** must complete first - authentication is core to everything
- Each workstream should use `/debug` workflow principles
- Document all bugs found in tasks.md with their locations
- Minimal fixes - don't refactor unless necessary

## Workstreams
1. **Shared** - Authentication core (jwtUtils, tokenStorage, authService, AuthContext)
2. **Frontend** - UI components, pages, router, layouts
3. **Backend** - Netlify functions (auth, ai, calendar, employees, projects, tasks)
4. **Integration** - Stores, types, and integration testing
