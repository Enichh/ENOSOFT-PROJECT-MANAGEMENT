import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import ChatPanel from '../ai/ChatPanel';

export default function AdminLayout() {
  const { sidebarOpen } = useUiStore();
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/employees', label: 'Employees', icon: '👥' },
    { path: '/admin/projects', label: 'Projects', icon: '📁' },
    { path: '/admin/calendar', label: 'Calendar', icon: '📅' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className={`font-bold text-xl text-primary-600 ${!sidebarOpen && 'hidden'}`}>
            EnoSoft
          </h1>
          <span className={`${sidebarOpen && 'hidden'} text-2xl`}>📋</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={!sidebarOpen ? 'hidden' : ''}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={clearAuth}
            className="flex items-center gap-3 px-3 py-2 w-full text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className={!sidebarOpen ? 'hidden' : ''}>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => useUiStore.getState().toggleSidebar()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ☰
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm">
              {user?.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
      <ChatPanel />
    </div>
  );
}
