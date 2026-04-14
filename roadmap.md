# Project Roadmap

## Active Focus

Deployment preparation and integration testing for EnoSoft Project Management System

## Feature Plan

- [x] **Shared** - Data models, types, API contracts
- [x] **Auth** - Authentication system (login, roles, JWT)
- [x] **Backend** - Netlify functions, AI integration, data layer
- [x] **Frontend-Core** - React app shell, routing, state management
- [x] **Admin-UI** - Admin dashboard, employee/project CRUD, calendar
- [x] **Employee-UI** - Employee dashboard, task views, project history
- [x] **AI-Features** - AI chat interface, recommendation engine
- [ ] **Integration Testing** - Cross-workstream functionality verification
- [x] **Deployment** - Netlify deployment configuration (build fixed with npx)
- [ ] **Performance Optimization** - Bundle optimization and caching

## File Tree

### Root Configuration

```
MIs/
|- .env                    # Environment variables
|- .git/                   # Git repository
|- .parallel/              # Parallel workstream coordination
|  |- FEATURE.md           # Project requirements
|  |- PROMPTS.md           # AI prompts for workstreams
|  |- tasks.md             # Task breakdown
|  |- workstream-*.md      # Individual workstream docs
|- index.html              # Entry point
|- netlify.toml            # Netlify deployment config
|- package.json            # Dependencies and scripts
|- tailwind.config.js      # TailwindCSS configuration
|- tsconfig.json           # TypeScript configuration
|- vite.config.ts          # Vite build configuration
```

### Source Code Structure

```
src/
|- auth/                   # Authentication system
|  |- AuthContext.tsx      # Authentication context
|  |- ProtectedRoute.tsx   # Route protection wrapper
|  |- authService.ts       # Authentication service
|  |- hooks/               # Authentication hooks
|  |- jwtUtils.ts          # JWT utilities
|  |- passwordUtils.ts     # Password handling
|  |- tokenStorage.ts      # Token management
|- components/             # Reusable UI components
|  |- admin/               # Admin-specific components
|  |- ai/                  # AI chat and recommendations
|  |- assignments/         # Project assignment components
|  |- calendar/            # Calendar components
|  |- employees/           # Employee management
|  |- history/             # Project history
|  |- layout/              # Layout components
|  |- projects/            # Project components
|  |- tasks/               # Task management
|  |- team/                # Team view components
|  |- ui/                  # Base UI components
|- lib/                    # Utility libraries
|  |- apiClient.ts         # API client configuration
|- pages/                  # Route-level components
|  |- admin/               # Admin pages
|  |- employee/            # Employee pages
|  |- login/               # Authentication pages
|- stores/                 # Zustand state management
|  |- authStore.ts         # Authentication state
|  |- chatStore.ts         # AI chat state
|  |- recommendationsStore.ts # AI recommendations state
|  |- uiStore.ts           # UI state management
|- types/                  # TypeScript definitions
|  |- aiPrompts.ts         # AI prompt templates
|  |- api.ts               # API interface definitions
|  |- constants.ts         # Application constants
|  |- models.ts            # Data models
|  |- permissions.ts       # Permission definitions
|- index.css               # Global styles
|- main.tsx                # Application entry point
|- router.tsx              # React Router configuration
```

### Backend Functions

```
netlify/functions/
|- ai/                     # AI integration functions
|- auth/                   # Authentication functions
|- calendar/               # Calendar management functions
```

## Dependencies

### Core Dependencies

- React 18.3.1 + TypeScript 5.6.0
- TailwindCSS 3.4.14 + PostCSS
- Zustand 5.0.0 (state management)
- React Router 6.28.0 (routing)
- FullCalendar 6.1.20 (calendar)

### Netlify Integration

- @netlify/functions 2.8.0
- @netlify/blobs 8.0.0

### AI & API

- OpenAI 4.67.0
- @tanstack/react-query 5.59.0

### Development

- Vite 5.4.10 (build tool)
- ESLint (code quality)
