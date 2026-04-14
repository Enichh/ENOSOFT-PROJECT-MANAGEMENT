import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import LoginPage from './pages/login/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import EmployeeLayout from './components/layout/EmployeeLayout';
import AdminDashboardPage from './pages/admin/DashboardPage';
import EmployeesPage from './pages/admin/EmployeesPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import CalendarPage from './pages/admin/CalendarPage';
import EmployeeDashboardPage from './pages/employee/DashboardPage';
import TasksPage from './pages/employee/TasksPage';
import HistoryPage from './pages/employee/HistoryPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'employees',
        element: <EmployeesPage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
    ],
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute requiredRole="employee">
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/employee/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <EmployeeDashboardPage />,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
    ],
  },
]);
