import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { api } from '../../lib/apiClient';
import { Task } from '../../types/models';
import { useAuthStore } from '../../stores/authStore';

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: number;
}

export default function EmployeeSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTasksCount, setActiveTasksCount] = useState(0);
  const location = useLocation();
  const { clearAuth } = useAuthStore();

  useEffect(() => {
    fetchTasksCount();
  }, []);

  const fetchTasksCount = async () => {
    try {
      const response = await api.get<Task[]>('/api/tasks');
      setTasks(response);
      const activeCount = response.filter(task => task.status !== 'completed').length;
      setActiveTasksCount(activeCount);
    } catch (error) {
      console.error('Error fetching tasks count:', error);
    }
  };

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/employee/dashboard',
      icon: '📊'
    },
    {
      name: 'My Tasks',
      href: '/employee/tasks',
      icon: '✅',
      badge: activeTasksCount
    },
    {
      name: 'Project History',
      href: '/employee/history',
      icon: '📜'
    },
    {
      name: 'My Team',
      href: '/employee/team',
      icon: '👥'
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">Employee Portal</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive(item.href)
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <span className="flex-shrink-0 text-xl">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="ml-3">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span className="flex-shrink-0 text-xl">🚪</span>
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}