import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, Globe } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  
  // Basic frontend check. Real check happens on backend.
  // In a real app we'd fetch the user profile to check role, 
  // but we can rely on the backend rejecting API calls for now.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: Users, label: 'Users' },
    // Mock routes for future expansion
    { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/admin/resumes', icon: FileText, label: 'Resumes' },
    { to: '/admin/fellowships', icon: Globe, label: 'Fellowships' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden dark:bg-gray-900">
      {/* Admin Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Admin Panel
          </span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-gray-50 dark:bg-gray-900">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
