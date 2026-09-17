import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './i18n/config';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import { PageLoader } from './components/common/index';

// Lazy load pages
import { lazy, Suspense } from 'react';
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const HRDashboard = lazy(() => import('./pages/HRDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const SkillGapPage = lazy(() => import('./pages/SkillGapPage'));
const LearningPathPage = lazy(() => import('./pages/LearningPathPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const WeeklyReportsPage = lazy(() => import('./pages/WeeklyReportsPage'));
const MeetingsPage = lazy(() => import('./pages/MeetingsPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const PerformancePage = lazy(() => import('./pages/PerformancePage'));
const EmployeeDetailPage = lazy(() => import('./pages/EmployeeDetailPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ChatbotPage = lazy(() => import('./pages/ChatbotPage'));
const AILearningPage = lazy(() => import('./pages/AILearningPage'));


// Protected Route with Compulsory Employee Assessment Gate
function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;

  // Compulsory first-time AI Skill Assessment for employees
  if (user?.role === 'employee' && !user?.hasCompletedAssessment) {
    const allowedPaths = ['/onboarding', '/assessment/initial', '/assessment/compulsory'];
    if (!allowedPaths.includes(location.pathname)) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return children || <Outlet />;
}

// Public layout (Navbar + Footer)
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/faqs" element={<LandingPage />} />
        <Route path="/helpdesk" element={<ChatbotPage />} />
      </Route>

      {/* Protected — Employee */}
      <Route element={<DashboardLayout />}>
        <Route element={<ProtectedRoute roles={['employee', 'hr', 'admin']} />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/skill-gap" element={<SkillGapPage />} />
          <Route path="/learning-path" element={<LearningPathPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/recommended" element={<CoursesPage />} />
          <Route path="/courses/progress" element={<CoursesPage />} />
          <Route path="/ai-learning" element={<AILearningPage />} />
          <Route path="/helpdesk" element={<AILearningPage />} />
          <Route path="/weekly-reports" element={<WeeklyReportsPage />} />

          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<OnboardingPage />} />
          <Route path="/reports" element={<WeeklyReportsPage />} />
          <Route path="/announcements" element={<NotificationsPage />} />
        </Route>

        {/* Protected — HR */}
        <Route element={<ProtectedRoute roles={['hr', 'admin']} />}>
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/employees/:id" element={<EmployeeDetailPage />} />
        </Route>

        {/* Protected — Admin */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Secure Proctored Environment (Standalone, No Navbars) */}
      <Route element={<ProtectedRoute roles={['employee', 'hr', 'admin']} />}>
        <Route path="/assessment/:type" element={<AssessmentPage />} />
        <Route path="/assessment/history" element={<AssessmentPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
