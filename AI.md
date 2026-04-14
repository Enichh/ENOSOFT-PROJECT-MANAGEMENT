# Project Context for AI Assistants

## Project Purpose & Tech Stack

**EnoSoft Project Management System** - A web-based project management application with AI integration, deployed on Netlify. Supports admin and employee roles with CRUD operations, calendar management, and AI-powered recommendations.

**Stack:** React 18.3.1, TypeScript 5.6.0, TailwindCSS 3.4.14, Zustand 5.0.0, React Router 6.28.0, FullCalendar 6.1.20, Netlify Functions, JWT authentication

## Architecture Overview

- **Frontend Structure:** React SPA with TypeScript, component-based architecture
- **State Management:** Zustand stores (authStore, chatStore, recommendationsStore, uiStore)
- **Authentication:** JWT-based with role-based access control (admin/employee)
- **Deployment:** Netlify static hosting with serverless functions
- **Data Storage:** Netlify Blob Store + LocalStorage for client-side persistence
- **AI Integration:** OpenAI/Anthropic API via Netlify Functions

### Key Directories
- `src/auth/` - Authentication system, JWT utilities, protected routes
- `src/components/` - Reusable UI components organized by feature
- `src/pages/` - Route-level components (admin/employee/login)
- `src/stores/` - Zustand state management
- `src/types/` - TypeScript interfaces and API contracts
- `netlify/functions/` - Serverless backend functions
- `.parallel/` - Parallel workstream coordination files

## Sacred Cows (DO NOT MODIFY WITHOUT EXPLICIT APPROVAL)

- `src/types/models.ts` - Core data models that all components depend on
- `src/auth/AuthContext.tsx` - Authentication context provider
- `src/router.tsx` - Application routing configuration
- `package.json` - Dependency management and build scripts
- `.parallel/FEATURE.md` - Project requirements and workstream definitions

## Conventions & Style

- **File naming:** camelCase for all files and directories (per project rules)
- **Component naming:** PascalCase for React components
- **State Management:** Zustand stores with TypeScript interfaces
- **API Integration:** Netlify functions with proper error handling
- **Styling:** TailwindCSS utility classes, responsive design
- **Code Style:** Single responsibility functions, early returns, minimal comments

## Recent Context / Current Focus

- **2025-04-15:** Project initialization completed with full parallel workstream structure
- **Current Status:** All 7 workstreams implemented (Shared, Auth, Backend, Frontend-Core, Admin-UI, Employee-UI, AI-Features)
- **Ready for:** Testing, deployment preparation, and integration verification