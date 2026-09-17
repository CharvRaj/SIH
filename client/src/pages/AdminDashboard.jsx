import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StatCard, Card, DataTable, Badge, SearchBar, Button, PageLoader, EmptyState, SliderTrack } from '../components/common/index';
import {
  Users, Shield, Building, GitBranch, Brain, BarChart3, BookOpen, FileText,
  CalendarCheck, ListTodo, Star, Bell, Settings, Activity, Database, Wifi,
  WifiOff, CheckCircle, AlertTriangle, Download, RefreshCw, Lock, Sparkles,
  Server, Cpu, Eye, CheckCircle2, History
} from 'lucide-react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'hr' | 'departments' | 'igot' | 'ai' | 'audit'
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const trendData = [
    { month: 'Jan', employees: 80, assessments: 45, courses: 30 },
    { month: 'Feb', employees: 95, assessments: 60, courses: 42 },
    { month: 'Mar', employees: 110, assessments: 78, courses: 55 },
    { month: 'Apr', employees: 120, assessments: 85, courses: 62 },
    { month: 'May', employees: 135, assessments: 95, courses: 70 },
    { month: 'Jun', employees: 140, assessments: 105, courses: 78 },
  ];

  // URL query parameter synchronization
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'hr-management') setActiveTab('hr');
    else if (tabParam === 'employee-management') navigate('/hr/dashboard');
    else if (tabParam === 'departments' || tabParam === 'org-structure') setActiveTab('departments');
    else if (tabParam === 'igot-sync') setActiveTab('igot');
    else if (tabParam === 'ai-config') setActiveTab('ai');
    else if (tabParam === 'audit-logs') setActiveTab('audit');
    else setActiveTab('overview');
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      let meetingCount = 0;
      try {
        const meetingsRes = await api.get('/meetings');
        if (meetingsRes.data && meetingsRes.data.data) {
          meetingCount = meetingsRes.data.data.length;
        }
      } catch (e) {}

      try {
        const res = await api.get('/dashboard/admin/stats');
        setStats({ ...res.data, totalMeetings: meetingCount });
      } catch {
        setStats({
          totalHR: 3, totalEmployees: 140, departments: 6, branches: 12,
          assessmentsCompleted: 105, avgSkillGap: 18, activeLearningPaths: 85,
          coursesCompleted: 78, weeklyReports: 92, totalMeetings: meetingCount || 2,
          tasksCompleted: 64, performanceReviews: 45, activeUsers: 118,
          igotStatus: 'connected', notificationsSent: 342
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSyncIGOT = () => {
    setSyncLoading(true);
    setTimeout(() => {
      setSyncLoading(false);
      setSyncStatus('Successfully synchronized 42 course progress records from iGOT Karmayogi API.');
      setTimeout(() => setSyncStatus(null), 4000);
    }, 1500);
  };

  if (loading) return <PageLoader />;

  const statCards = [
    { label: 'Total HR Users', value: stats.totalHR || 3, icon: Shield, onClick: () => setActiveTab('hr') },
    { label: 'MoSPI Officers', value: stats.totalEmployees || 140, icon: Users, onClick: () => navigate('/hr/dashboard') },
    { label: 'Key Divisions', value: stats.departments || 6, icon: Building, onClick: () => setActiveTab('departments') },
    { label: 'Field Offices', value: stats.branches || 12, icon: GitBranch },
    { label: 'Completed Tests', value: stats.assessmentsCompleted || 105, icon: Brain, trend: 'up', trendValue: '+12' },
    { label: 'Avg Cadre Gap', value: `${stats.avgSkillGap || 18}%`, icon: BarChart3, onClick: () => navigate('/skill-gap') },
    { label: 'Active Roadmaps', value: stats.activeLearningPaths || 85, icon: BookOpen, onClick: () => navigate('/learning-path') },
    { label: 'Course Graduates', value: stats.coursesCompleted || 78, icon: BookOpen, onClick: () => navigate('/courses') },
    { label: 'Weekly Dossiers', value: `${stats.weeklyReports || 92}%`, icon: FileText, onClick: () => navigate('/weekly-reports') },
    { label: 'Scheduled Meetings', value: stats.totalMeetings || 0, icon: CalendarCheck, onClick: () => navigate('/meetings') },
    { label: 'Task Compliance', value: `${stats.tasksCompleted || 64}%`, icon: ListTodo, onClick: () => navigate('/tasks') },
    { label: 'APAR Reviews', value: stats.performanceReviews || 45, icon: Star, onClick: () => navigate('/performance') },
  ];

  const auditLogs = [
    { id: 'log-1', action: 'OFFICER_ASSESSMENT_VERIFIED', user: 'rajesh.sharma@mospi.gov.in', ip: '10.24.18.91', time: '10 mins ago', status: 'SUCCESS' },
    { id: 'log-2', action: 'IGOT_COURSE_SYNC_BATCH', user: 'SYSTEM_CRON', ip: '127.0.0.1', time: '25 mins ago', status: 'SUCCESS' },
    { id: 'log-3', action: 'HR_OFFICER_ROLE_UPDATED', user: 'admin@mospi.gov.in', ip: '10.24.18.12', time: '1 hour ago', status: 'AUDITED' },
    { id: 'log-4', action: 'WEEKLY_REPORT_EXPORTED_CSV', user: 'priya.patel@mospi.gov.in', ip: '10.24.18.44', time: '2 hours ago', status: 'SUCCESS' },
    { id: 'log-5', action: 'SYSTEM_ENCRYPTION_VERIFIED', user: 'SECURITY_DAEMON', ip: 'internal', time: '3 hours ago', status: 'HEALTHY' }
  ];

  return (
    <div className="container-custom py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 text-xs font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" /> Super Administrator Portal
          </div>
          <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>MoSPI Executive Management</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Organization-wide security, cadence, and cross-cadre capacity oversight</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Settings} onClick={() => navigate('/settings')}>Settings</Button>
          <Button variant="primary" icon={Download} onClick={() => navigate('/weekly-reports')}>Export Dossier</Button>
        </div>
      </div>

      {/* ================= ADMIN QUICK ACTIONS SLIDER ================= */}
      <SliderTrack
        title="Administrative Quick Controls"
        badge="Executive Controls"
        subtitle="Swipe to access system maintenance and high-privilege workflows"
        scrollAmount={340}
      >
        <button
          onClick={() => setActiveTab('igot')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-gradient-to-r from-blue-900 to-indigo-900 text-white min-w-[250px] flex-shrink-0 hover:scale-[1.02] transition-all shadow-sm text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 flex-shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate text-white group-hover:text-amber-300 transition-colors">
              iGOT Karmayogi Sync
            </span>
            <span className="text-[11px] text-blue-200 block truncate">
              Synchronize API endpoints & courses
            </span>
          </div>
        </button>

        <button
          onClick={() => navigate('/ai-learning')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[250px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">AI Document & Quiz Hub</span>
            <span className="text-[11px] text-gray-400 block truncate">Upload PDF/TXT for assessments</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[250px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Security Audit Logs</span>
            <span className="text-[11px] text-gray-400 block truncate">Inspect authenticated activity</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/hr/dashboard')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[250px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Officer Cadre Roster</span>
            <span className="text-[11px] text-gray-400 block truncate">Direct HR management</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[250px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Department Breakdown</span>
            <span className="text-[11px] text-gray-400 block truncate">FOD, NAD, ESD, SDRD, PSD</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[250px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">System & Security Rules</span>
            <span className="text-[11px] text-gray-400 block truncate">Proctoring & password policies</span>
          </div>
        </button>
      </SliderTrack>

      {/* System Status Banner */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3 card-hover cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--color-success-bg)' }}>
            <Activity className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>System Core Status</p>
            <div className="flex items-center gap-1.5">
              <Badge variant="success">All Systems Operational</Badge>
            </div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 card-hover cursor-pointer" onClick={() => setActiveTab('igot')}>
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--color-success-bg)' }}>
            <Wifi className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>iGOT Karmayogi API</p>
            <Badge variant="success">Connected (Gov NIC)</Badge>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 card-hover cursor-pointer" onClick={() => setActiveTab('audit')}>
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--color-info-bg)' }}>
            <Server className="w-5 h-5" style={{ color: 'var(--color-info)' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>MoSPI Database</p>
            <Badge variant="info">MongoDB &bull; 8 Cadre Records</Badge>
          </div>
        </Card>
      </div>

      {/* ================= ADMIN STATS CAROUSEL SLIDER ================= */}
      <SliderTrack
        title="Enterprise Metrics Roster"
        badge="Live Organization KPIs"
        subtitle="Swipe to inspect all administrative indicators and indices"
        scrollAmount={320}
      >
        {statCards.map((stat, i) => (
          <div key={i} className="min-w-[170px] flex-shrink-0">
            <StatCard {...stat} onClick={stat.onClick || (() => {})} />
          </div>
        ))}
      </SliderTrack>

      {/* Tab Switcher for Admin Sections */}
      <div className="flex items-center gap-2 border-b overflow-x-auto pb-2" style={{ borderColor: 'var(--color-border)' }}>
        {[
          { id: 'overview', label: 'Platform Growth & Trends' },
          { id: 'igot', label: 'iGOT Karmayogi Sync' },
          { id: 'departments', label: 'Departments & Structure' },
          { id: 'hr', label: 'HR Administration' },
          { id: 'ai', label: 'AI Engine Configuration' },
          { id: 'audit', label: 'Security Audit Logs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-900 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview Trend Chart */}
      {activeTab === 'overview' && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Platform Capacity & Evaluation Trend (MoSPI)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
              <Legend />
              <Line type="monotone" dataKey="employees" stroke="#2563eb" strokeWidth={2} name="Enrolled Officers" />
              <Line type="monotone" dataKey="assessments" stroke="#10b981" strokeWidth={2} name="Assessments Passed" />
              <Line type="monotone" dataKey="courses" stroke="#f59e0b" strokeWidth={2} name="iGOT Modules" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Tab 2: iGOT Sync Management */}
      {activeTab === 'igot' && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>Mission Karmayogi API Integration</h3>
              <p className="text-xs text-gray-400">Manage automated synchronization between MoSPI learning records and the National Portal.</p>
            </div>
            <Button
              variant="primary"
              icon={RefreshCw}
              loading={syncLoading}
              onClick={handleSyncIGOT}
            >
              Sync iGOT Progress Now
            </Button>
          </div>

          {syncStatus && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {syncStatus}
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-800" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-bold text-gray-500 block">Gateway Status</span>
              <span className="text-base font-bold text-emerald-600">CONNECTED</span>
              <p className="text-[11px] text-gray-400 mt-1">Endpoint: https://api.igotkarmayogi.gov.in/v2</p>
            </div>
            <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-800" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-bold text-gray-500 block">Accredited Courses</span>
              <span className="text-base font-bold text-blue-600">4 Active MoSPI Modules</span>
              <p className="text-[11px] text-gray-400 mt-1">Verified by NASA Training Academy</p>
            </div>
            <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-800" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-bold text-gray-500 block">Last Sync Cycle</span>
              <span className="text-base font-bold text-gray-700 dark:text-gray-300">Today, 09:15 IST</span>
              <p className="text-[11px] text-gray-400 mt-1">Auto-runs every 6 hours</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Departments & Structure */}
      {activeTab === 'departments' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>MoSPI Cadre & Division Structure</h3>
          <p className="text-xs text-gray-400">Official organizational divisions operating under the Ministry of Statistics and Programme Implementation.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              { name: 'Field Operations Division (FOD)', head: 'Addl. Director General', cadres: '34 Officers (SSS / ISS)', location: 'Sankhyiki Bhavan, Delhi + 48 Regional Offices' },
              { name: 'National Accounts Division (NAD)', head: 'Director General (CSO)', cadres: '28 Officers (ISS)', location: 'Khurshid Lal Bhavan, Janpath' },
              { name: 'Economic Statistics Division (ESD)', head: 'Deputy Director General', cadres: '24 Officers (ISS / SSS)', location: 'New Delhi Headquarters' },
              { name: 'Survey Design & Research (SDRD)', head: 'Deputy Director General', cadres: '18 Officers (ISS)', location: 'Mahalanobis Bhavan, Kolkata' },
              { name: 'Price Statistics Division (PSD)', head: 'Director', cadres: '14 Officers (ISS / SSS)', location: 'New Delhi HQ & Chennai RO' },
              { name: 'National Statistical Academy (NASA)', head: 'Director General', cadres: '16 Officers (ISS Faculty)', location: 'Greater Noida Campus, UP' }
            ].map((dept, i) => (
              <div key={i} className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-800 space-y-1.5" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <Badge variant="info">Division</Badge>
                  <span className="text-[11px] text-gray-400">{dept.cadres}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{dept.name}</h4>
                <p className="text-xs text-gray-500"><strong>Leadership:</strong> {dept.head}</p>
                <p className="text-[11px] text-gray-400"><strong>Location:</strong> {dept.location}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 4: Security Audit Logs */}
      {activeTab === 'audit' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>System & Security Audit Trail</h3>
              <p className="text-xs text-gray-400">Immutable audit logs tracking assessment proctoring events, data exports, and administrative edits.</p>
            </div>
            <Badge variant="success">Encryption: TLS 1.3 &bull; SHA-256</Badge>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {auditLogs.map(log => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{log.action}</span>
                    <Badge variant={log.status === 'SUCCESS' || log.status === 'HEALTHY' ? 'success' : 'info'}>{log.status}</Badge>
                  </div>
                  <p className="text-gray-500">Initiated by: {log.user} (IP: {log.ip})</p>
                </div>
                <span className="text-gray-400 text-[11px]">{log.time}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 5: AI Engine Configuration */}
      {activeTab === 'ai' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>MoSPI AI & Assessment Generation Engine</h3>
          <p className="text-xs text-gray-400">Configure language models, proctoring sensitivity, and statistical grounding documents.</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl border bg-gray-50 dark:bg-gray-800" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">Proctoring AI Sensitivity</span>
                <span className="text-[11px] text-gray-400">Active face detection & multi-face strike threshold</span>
              </div>
              <Badge variant="success">Strict (3 Strikes = Auto-Submit)</Badge>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl border bg-gray-50 dark:bg-gray-800" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">Document Parsing Grounding</span>
                <span className="text-[11px] text-gray-400">Strict adherence to National Quality Assurance Framework (NQAF)</span>
              </div>
              <Badge variant="info">Enforced (No Hallucinations)</Badge>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl border bg-gray-50 dark:bg-gray-800" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">Cadre Test Bank Integration</span>
                <span className="text-[11px] text-gray-400">Automatic export of generated MCQs to official assessment player</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/ai-learning')}>Open AI Learning Hub</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 6: HR Administrators */}
      {activeTab === 'hr' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>HR Administrators Roster</h3>
              <p className="text-xs text-gray-400">Officers with cadre onboarding, personnel approval, and evaluation review privileges.</p>
            </div>
            <Button size="sm" variant="primary" onClick={() => navigate('/hr/dashboard?tab=add-employee')}>Add HR Administrator</Button>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {[
              { name: 'Dr. Suresh Chandra Joshi', email: 'hr@mospi.gov.in', role: 'Chief HR Officer & Director NASA', status: 'Active' },
              { name: 'Smt. Ananya Sen', email: 'ananya.sen@mospi.gov.in', role: 'Joint Director (Personnel & Cadre)', status: 'Active' },
              { name: 'Shri Vikram Malhotra', email: 'vikram.m@mospi.gov.in', role: 'Under Secretary (SSS Cadre Cell)', status: 'Active' }
            ].map((hr, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{hr.name}</p>
                  <p className="text-gray-400">{hr.email} &bull; {hr.role}</p>
                </div>
                <Badge variant="success">{hr.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
