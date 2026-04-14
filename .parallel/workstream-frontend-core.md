# Workstream: Frontend-Core - React App Foundation

**Status**: Can start after Shared, Auth | **Priority**: High
**Dependencies**: Shared, Auth

## Goal
Set up the React application shell with routing, state management, and base components.

## Deliverables

### 1. Project Initialization
```bash
# Using Vite + React + TypeScript
npm create vite@latest enosoft -- --template react-ts

# Install dependencies
npm install react-router-dom @tanstack/react-query zustand tailwindcss postcss autoprefixer
npm install -D @types/react @types/react-dom

# AI libraries
npm install openai
```

### 2. Tailwind Configuration (`tailwind.config.js`)
```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { /* brand colors */ },
        // semantic colors for statuses
      }
    }
  }
}
```

### 3. Router Setup (`src/router.tsx`)
```typescript
// Role-based route configuration
const routes = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>,
    children: [/* admin routes */]
  },
  {
    path: '/employee',
    element: <ProtectedRoute requiredRole="employee"><EmployeeLayout /></ProtectedRoute>,
    children: [/* employee routes */]
  }
]);
```

### 4. API Client (`src/lib/apiClient.ts`)
```typescript
class ApiClient {
  private baseUrl: string;
  
  async get<T>(endpoint: string): Promise<T>
  async post<T>(endpoint: string, data: unknown): Promise<T>
  async put<T>(endpoint: string, data: unknown): Promise<T>
  async delete<T>(endpoint: string): Promise<T>
  
  // Automatic token injection
  // Error handling
  // Response parsing
}

export const api = new ApiClient();
```

### 5. Global State (Zustand) (`src/stores/`)
```typescript
// authStore.ts
interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

// uiStore.ts
interface UiStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  addNotification: (n: Notification) => void;
}
```

### 6. Layout Components

#### Main Layout (`src/components/layout/MainLayout.tsx`)
- Responsive container
- Sidebar + main content area

#### Admin Layout (`src/components/layout/AdminLayout.tsx`)
- Admin navigation items
- Quick actions (create project, create employee)

#### Employee Layout (`src/components/layout/EmployeeLayout.tsx`)
- Employee navigation
- Task summary widget

### 7. Common UI Components (`src/components/ui/`)
```typescript
// Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

// Input.tsx
interface InputProps {
  label: string;
  error?: string;
  helperText?: string;
}

// Modal.tsx
// Card.tsx
// Badge.tsx (for status indicators)
// LoadingSpinner.tsx
// EmptyState.tsx
// DataTable.tsx (sortable, filterable)
```

### 8. Pages Structure
```
src/pages/
├── login/
│   └── LoginPage.tsx
├── admin/
│   ├── DashboardPage.tsx
│   ├── EmployeesPage.tsx
│   ├── ProjectsPage.tsx
│   └── CalendarPage.tsx
└── employee/
    ├── DashboardPage.tsx
    ├── TasksPage.tsx
    └── HistoryPage.tsx
```

## Acceptance Criteria
- [ ] React app builds without errors
- [ ] Routing works with role protection
- [ ] API client handles auth tokens automatically
- [ ] Layouts are responsive
- [ ] UI components follow design system
- [ ] Loading and error states implemented

## Environment Variables
```
VITE_API_URL=/.netlify/functions
VITE_APP_NAME=EnoSoft
```

## Notes
- Use context7 MCP for React Router and React Query docs
- Keep components in separate folders with index exports
- Follow camelCase for all file names
