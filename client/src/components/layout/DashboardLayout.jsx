import { useState, useEffect, Suspense } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import GovLogo from './GovLogo';
import { PageLoader } from '../common/index';
import {
  LayoutDashboard, BookOpen, Compass, Target, ClipboardList, Bot,
  FolderLock, CheckSquare, Calendar, Megaphone, Award, BarChart3,
  FileText, HelpCircle, Settings, Users, UserPlus, Upload, Building2,
  TrendingUp, Shield, Network, BrainCircuit, Sliders, History,
  LogOut, ChevronLeft, ChevronRight, Menu, Bell, Sun, Moon,
  User, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const role = user?.role || 'employee';

  // Navigation configurations
  const employeeNav = [
    { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'My Learning', path: '/learning-path', icon: BookOpen },
    { label: 'Recommended Courses', path: '/courses/recommended', icon: Compass },
    { label: 'Skill Gap Analysis', path: '/skill-gap', icon: Target },
    { label: 'Assessments', path: '/assessment/history', icon: ClipboardList },
    { label: 'AI Learning Hub & MCQs', path: '/ai-learning', icon: Bot, badge: 'AI' },
    { label: 'My Documents', path: '/weekly-reports', icon: FolderLock },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Meetings', path: '/meetings', icon: Calendar },
    { label: 'Announcements', path: '/announcements', icon: Megaphone },
    { label: 'Certificates', path: '/performance', icon: Award },
    { label: 'Performance', path: '/performance', icon: BarChart3 },
    { label: 'Weekly Reports', path: '/weekly-reports', icon: FileText },
    { label: 'Helpdesk & Sahayak', path: '/ai-learning?tab=chat', icon: HelpCircle },
    { label: 'Profile & Settings', path: '/settings', icon: Settings },
  ];

  const hrNav = [
    { label: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
    { label: 'Employee Management', path: '/hr/dashboard?tab=employees', icon: Users },
    { label: 'Add Employee', path: '/hr/dashboard?tab=add-employee', icon: UserPlus },
    { label: 'Import Employees', path: '/hr/dashboard?tab=import', icon: Upload },
    { label: 'Departments', path: '/hr/dashboard?tab=departments', icon: Building2 },
    { label: 'Skill Gap Reports', path: '/skill-gap', icon: Target },
    { label: 'Learning Progress', path: '/courses/progress', icon: TrendingUp },
    { label: 'Assessments', path: '/assessment/history', icon: ClipboardList },
    { label: 'AI Learning & Quizzes', path: '/ai-learning', icon: Bot, badge: 'AI' },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Meetings', path: '/meetings', icon: Calendar },
    { label: 'Announcements', path: '/announcements', icon: Megaphone },
    { label: 'Performance Reviews', path: '/performance', icon: BarChart3 },
    { label: 'Reports & Exports', path: '/weekly-reports', icon: FileText },
    { label: 'HR Profile & Settings', path: '/settings', icon: Settings },
  ];

  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'HR Management', path: '/admin/dashboard?tab=hr-management', icon: Users },
    { label: 'Employee Management', path: '/hr/dashboard', icon: Users },
    { label: 'Department Management', path: '/admin/dashboard?tab=departments', icon: Building2 },
    { label: 'Organization Structure', path: '/admin/dashboard?tab=org-structure', icon: Network },
    { label: 'Skill Analytics', path: '/skill-gap', icon: Target },
    { label: 'Assessment Analytics', path: '/assessment/history', icon: ClipboardList },
    { label: 'iGOT Integration', path: '/admin/dashboard?tab=igot-sync', icon: Compass, badge: 'API' },
    { label: 'AI Configuration', path: '/admin/dashboard?tab=ai-config', icon: BrainCircuit, badge: 'AI' },
    { label: 'AI Learning & MCQs', path: '/ai-learning', icon: Bot, badge: 'AI' },
    { label: 'Course Configuration', path: '/courses', icon: BookOpen },
    { label: 'Meetings & Events', path: '/meetings', icon: Calendar },
    { label: 'Announcements', path: '/announcements', icon: Megaphone },
    { label: 'Reports & Exports', path: '/weekly-reports', icon: FileText },
    { label: 'Audit Logs', path: '/admin/dashboard?tab=audit-logs', icon: History },
    { label: 'Platform Settings', path: '/settings', icon: Sliders },
    { label: 'Security Settings', path: '/settings', icon: Shield },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'hr' ? hrNav : employeeNav;

  const roleLabel =
    role === 'admin' ? 'Super Administrator' :
    role === 'hr' ? 'HR Administrator' : 'Cadre Officer';

  const roleBadgeVariant =
    role === 'admin' ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300' :
    role === 'hr' ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300' :
    'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300';


  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-secondary)]">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex flex-col border-r transition-all duration-300 select-none z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        {/* Sidebar Header Logo */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          {!collapsed ? (
            <GovLogo compact={true} />
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                GOI
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {(() => {
            const currentFullPath = location.pathname + location.search;
            // Find best match: exact full-path match wins over pathname-only
            let activeIdx = navItems.findIndex(item => item.path === currentFullPath);
            if (activeIdx === -1) {
              activeIdx = navItems.findIndex(item => !item.path.includes('?') && location.pathname === item.path);
            }
            return navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIdx;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all text-left group ${
                    isActive
                      ? 'bg-blue-900 text-white font-semibold shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-900 dark:hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-400 group-hover:text-blue-700'}`} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            });
          })()}
        </div>

        {/* Sidebar Footer User info */}
        <div className="p-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          {!collapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</p>
                <p className="text-[10px] truncate text-gray-400">{roleLabel}</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[var(--color-bg-card)] border-r" style={{ borderColor: 'var(--color-border)' }}>
            <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <GovLogo compact={true} />
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-md text-gray-500">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {(() => {
                const currentFullPath = location.pathname + location.search;
                let activeIdx = navItems.findIndex(item => item.path === currentFullPath);
                if (activeIdx === -1) {
                  activeIdx = navItems.findIndex(item => !item.path.includes('?') && location.pathname === item.path);
                }
                return navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeIdx;
                  return (
                    <button
                      key={index}
                      onClick={() => { navigate(item.path); setMobileOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg text-left ${
                        isActive ? 'bg-blue-900 text-white font-bold' : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header
          className="h-16 border-b flex items-center justify-between px-4 md:px-6 z-20 flex-shrink-0"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Ministry Portal Header & Breadcrumb */}
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                MoSPI Adaptive Capacity Platform &bull; Mission Karmayogi
              </span>
              <span className="text-[11px] text-gray-400">
                Official Portal of the Ministry of Statistics and Programme Implementation
              </span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${roleBadgeVariant}`}>
              {roleLabel}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
              title={`Switch theme (current: ${resolvedTheme})`}
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-700" />}
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Officer Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs border border-amber-400">
                  {user?.name?.[0]?.toUpperCase() || 'O'}
                </div>
                <span className="hidden lg:block text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white dark:bg-gray-900 shadow-xl py-2 z-50" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                      {user?.department || 'General Administration'}
                    </span>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                    className="w-full px-4 py-2 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <User className="w-4 h-4 text-gray-400" /> Cadre Profile
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                    className="w-full px-4 py-2 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <Settings className="w-4 h-4 text-gray-400" /> Settings & Security
                  </button>
                  <div className="border-t my-1" style={{ borderColor: 'var(--color-border)' }} />
                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="w-full px-4 py-2 text-xs text-left hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2 text-rose-600 font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <Suspense fallback={<PageLoader />}>
            <Outlet key={location.pathname + location.search} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
