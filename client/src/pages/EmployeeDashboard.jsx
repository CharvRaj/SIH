import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StatCard, Card, ProgressBar, Badge, Button, Tabs, SliderTrack } from '../components/common/index';

import {
  Target, BookOpen, Award, ClipboardList, CheckSquare, Calendar,
  Flame, TrendingUp, ArrowRight, ExternalLink, Download, Clock,
  FileText, Sparkles, AlertCircle, CheckCircle2, ChevronRight,
  Bot, Upload, MessageSquare, PlayCircle, Bookmark
} from 'lucide-react';
import api from '../services/api';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load latest completed assessment result from user or storage
  const [assessmentResult, setAssessmentResult] = useState(() => {
    try {
      const saved = localStorage.getItem(`mospi-assessment-result-${user?.email}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      overallScore: 84,
      completionDate: '15 Sep 2026',
      topicScores: [
        { topic: 'Price Statistics (CPI)', score: 90 },
        { topic: 'Survey Sampling & Estimation', score: 85 },
        { topic: 'National Accounts & GVA', score: 80 },
        { topic: 'Industrial Statistics (IIP)', score: 88 },
        { topic: 'Data Ethics & NQAF', score: 95 }
      ],
      strengths: ['Price Statistics (CPI)', 'Data Ethics & NQAF', 'Industrial Statistics'],
      gaps: ['National Accounts & GVA', 'Sampling Variance Estimation']
    };
  });

  const [activeLearningTab, setActiveLearningTab] = useState('all');
  const [savedCourses, setSavedCourses] = useState(new Set(['IGOT-MOSPI-101']));

  const toggleSaveCourse = (id) => {
    setSavedCourses(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Official iGOT Karmayogi Courses
  const igotCourses = [
    {
      id: 'IGOT-MOSPI-101',
      title: 'National Statistical Framework & Official Data Quality in India',
      description: 'Foundational curriculum on National Quality Assurance Framework (NQAF) and official survey governance.',
      provider: 'MoSPI National Statistical Systems Training Academy (NASA)',
      category: 'Statistical Knowledge',
      duration: '6 Hours',
      level: 'Foundation',
      status: 'In Progress',
      progress: 65,
      url: 'https://igotkarmayogi.gov.in'
    },
    {
      id: 'IGOT-MOSPI-202',
      title: 'Consumer Price Index (CPI) Compilation & Survey Methodologies',
      description: 'Compilation workflows, chained Laspeyres indices, and seasonal item adjustments for rural/urban series.',
      provider: 'Central Statistics Office (CSO) & NASA',
      category: 'Price Statistics',
      duration: '8 Hours',
      level: 'Intermediate',
      status: 'Enrolled',
      progress: 25,
      url: 'https://igotkarmayogi.gov.in'
    },
    {
      id: 'IGOT-MOSPI-303',
      title: 'Survey Sampling Techniques & NSS Variance Estimation',
      description: 'Stratified multi-stage designs, sub-sample variance formulations, and CAPI digital field capture.',
      provider: 'Indian Statistical Institute (ISI) Kolkata & MoSPI',
      category: 'Data Analysis',
      duration: '10 Hours',
      level: 'Advanced',
      status: 'Recommended',
      progress: 0,
      url: 'https://igotkarmayogi.gov.in'
    },
    {
      id: 'IGOT-MOSPI-404',
      title: 'National Accounts Statistics & Gross Value Added (GVA)',
      description: 'Institutional sectors compilation, sequence of accounts, and corporate financial integration via MCA-21.',
      provider: 'National Accounts Division (NAD)',
      category: 'Statistical Knowledge',
      duration: '12 Hours',
      level: 'Advanced',
      status: 'Completed',
      progress: 100,
      url: 'https://igotkarmayogi.gov.in'
    }
  ];

  // Skill Gap Analysis Data
  const skillGaps = [
    { skill: 'Survey Sampling & Estimation', current: 85, required: 90, gap: 5, priority: 'Medium', action: 'Complete NSS Variance Module' },
    { skill: 'National Accounts & GVA Compilation', current: 80, required: 90, gap: 10, priority: 'High', action: 'Enroll in MCA-21 Corporate Accounts' },
    { skill: 'CPI Index Calculation', current: 90, required: 85, gap: 0, priority: 'Low', action: 'Achieved Ministry Benchmark' },
    { skill: 'Digital Data Analytics (R / Python)', current: 68, required: 80, gap: 12, priority: 'High', action: 'Practice CAPI Scripting on MoSPI Sandbox' },
    { skill: 'Data Ethics & Public Integrity', current: 95, required: 90, gap: 0, priority: 'Low', action: 'Achieved Ministry Benchmark' }
  ];

  const tasks = [
    { id: 't-1', title: 'Submit Field Verification Sample Batch (NSS Round 80)', priority: 'High', dueDate: '22 Sep 2026', status: 'Pending' },
    { id: 't-2', title: 'Complete Mission Karmayogi Ethics Module', priority: 'Medium', dueDate: '28 Sep 2026', status: 'In Progress' },
    { id: 't-3', title: 'Review Annual Survey of Industries (ASI) Scrutiny Notes', priority: 'Low', dueDate: '30 Sep 2026', status: 'Pending' }
  ];

  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await api.get('/meetings');
        if (res.data && res.data.data) {
          setMeetings(res.data.data.slice(0, 3)); // Only show top 3 upcoming on dashboard
        }
      } catch (err) {
        console.error('Failed to fetch meetings', err);
      }
    };
    fetchMeetings();
  }, []);

  const filteredCourses = igotCourses.filter(c => {
    if (activeLearningTab === 'in-progress') return c.status === 'In Progress';
    if (activeLearningTab === 'completed') return c.status === 'Completed';
    if (activeLearningTab === 'saved') return savedCourses.has(c.id);
    return true;
  });

  const handleExportWeeklyReport = () => {
    const csvContent = [
      'MoSPI Cadre Officer Weekly Capacity & Performance Dossier',
      `Officer Name: ${user?.name || 'Rajesh Sharma'}`,
      `Employee ID: ${user?.employeeId || 'EMP-2024-080'}`,
      `Designation: ${user?.designation || 'Senior Statistical Officer (SSO)'}`,
      `Department: ${user?.department || 'Field Operations Division (FOD)'}`,
      `Generated Date: ${new Date().toLocaleDateString()}`,
      '',
      'Key Metric,Value,Status',
      `Skill Assessment Score,${assessmentResult?.overallScore || 84}%,Benchmark Met`,
      'Courses In Progress,2 Modules,Active',
      'Completed Qualifications,4 Courses,Accredited',
      'Learning Streak,14 Days,Exemplary',
      'Pending Cadre Deliverables,3 Tasks,On Schedule',
      'Upcoming Scrutiny Meets,2 Sessions,Confirmed',
      '',
      'Course ID,Title,Provider,Status,Progress',
      ...igotCourses.map(c => `"${c.id}","${c.title}","${c.provider}","${c.status}",${c.progress}%`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `MoSPI_Weekly_Dossier_${(user?.name || 'Officer').replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (

    <div className="page-container max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* ================= A. WELCOME SECTION ================= */}
      <Card className="p-6 md:p-8 bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white border-0 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-amber-300 text-xs font-semibold border border-blue-700">
              <Sparkles className="w-3.5 h-3.5" /> Mission Karmayogi Official Capacity Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || 'Cadre Officer'}
            </h1>
            <p className="text-sm text-blue-200 leading-relaxed max-w-2xl">
              Welcome back. Continue building your professional skills in official statistics and national data stewardship.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-300 pt-2">
              <span><strong>Department:</strong> {user?.department || 'Field Operations Division (FOD)'}</span>
              <span>&bull;</span>
              <span><strong>Designation:</strong> {user?.designation || 'Senior Statistical Officer (SSO)'}</span>
              <span>&bull;</span>
              <span><strong>Last Login:</strong> Today at 09:42 IST</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center min-w-[180px] w-full md:w-auto">
            <span className="text-xs font-medium text-blue-200">Profile Completion</span>
            <div className="text-3xl font-extrabold text-white my-1">100%</div>
            <ProgressBar value={100} max={100} className="mt-2 bg-white/20" color="#f59e0b" />
            <span className="text-[10px] text-emerald-300 block mt-1.5 font-semibold">✓ Verified Cadre File</span>
          </div>
        </div>
      </Card>

      {/* ================= INTERACTIVE QUICK ACTIONS SLIDER ================= */}
      <SliderTrack
        title="Cadre Operational Quick Actions"
        badge="Mission Karmayogi Action Hub"
        subtitle="Swipe or use controls to quickly jump to high-priority workflows"
        scrollAmount={360}
      >
        <button
          onClick={() => navigate('/ai-learning')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-gradient-to-r from-blue-900 to-indigo-900 text-white min-w-[260px] flex-shrink-0 hover:scale-[1.02] transition-all shadow-sm text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate text-white group-hover:text-amber-300 transition-colors">
              AI Learning Hub & MCQs
            </span>
            <span className="text-[11px] text-blue-200 block truncate">
              Upload PDF / TXT & generate quizzes
            </span>
          </div>
        </button>

        <button
          onClick={() => window.open('/assessment/initial', '_blank')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Take Proctored Test</span>
            <span className="text-[11px] text-gray-400 block truncate">Webcam & lockdown mode</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/skill-gap')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Skill Gap Matrix</span>
            <span className="text-[11px] text-gray-400 block truncate">Cadre competency benchmark</span>
          </div>
        </button>

        <a
          href="https://igotkarmayogi.gov.in"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left no-underline"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">iGOT Karmayogi Portal</span>
            <span className="text-[11px] text-gray-400 block truncate">Official National Platform</span>
          </div>
        </a>

        <button
          onClick={() => navigate('/learning-path')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">My Learning Path</span>
            <span className="text-[11px] text-gray-400 block truncate">Custom cadre roadmap</span>
          </div>
        </button>

        <button
          onClick={handleExportWeeklyReport}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Export Weekly Dossier</span>
            <span className="text-[11px] text-gray-400 block truncate">Download CSV report</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/meetings')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Field Scrutiny Meetings</span>
            <span className="text-[11px] text-gray-400 block truncate">NIC video conferences</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Cadre Deliverables</span>
            <span className="text-[11px] text-gray-400 block truncate">3 tasks due this cycle</span>
          </div>
        </button>
      </SliderTrack>

      {/* ================= B. 8 SUMMARY CARDS IN SLIDING CAROUSEL ================= */}
      <SliderTrack
        title="Cadre Key Performance Metrics"
        badge="Live Metrics"
        subtitle="Swipe to view all key indicators and status cards"
        scrollAmount={320}
      >
        <div className="min-w-[155px] flex-shrink-0">
          <StatCard
            label="Skill Score"
            value={`${assessmentResult?.overallScore || 84}%`}
            icon={Target}
            trend="up"
            trendValue="+4%"
            onClick={() => navigate('/skill-gap')}
          />
        </div>
        <div className="min-w-[155px] flex-shrink-0">
          <StatCard
            label="In Progress"
            value="2 Courses"
            icon={BookOpen}
            onClick={() => navigate('/learning-path')}
          />
        </div>
        <div className="min-w-[155px] flex-shrink-0">
          <StatCard
            label="Completed"
            value="4 Courses"
            icon={Award}
            onClick={() => navigate('/learning-path')}
          />
        </div>
        <div className="min-w-[155px] flex-shrink-0">
          <StatCard
            label="Pending Tests"
            value="1 Test"
            icon={ClipboardList}
            onClick={() => window.open('/assessment/history', '_blank')}
          />
        </div>
        <div className="min-w-[155px] flex-shrink-0">
          <StatCard
            label="Certificates"
            value="3 Earned"
            icon={Award}
            onClick={() => navigate('/performance')}
          />
        </div>
        <div className="min-w-[155px] flex-shrink-0">
          <StatCard
            label="Learning Streak"
            value="14 Days"
            icon={Flame}
            trend="up"
            trendValue="Active"
          />
        </div>
        <div className="min-w-[155px] flex-shrink-0">
          <StatCard
            label="Assigned Tasks"
            value="3 Tasks"
            icon={CheckSquare}
            onClick={() => navigate('/tasks')}
          />
        </div>
        <div className="min-w-[155px] flex-shrink-0">
          <StatCard
            label="Upcoming Meets"
            value="2 Review"
            icon={Calendar}
            onClick={() => navigate('/meetings')}
          />
        </div>
      </SliderTrack>

      {/* ================= C. SKILL ASSESSMENT RESULT & D. GAP ANALYSIS ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessment Result */}
        <Card className="p-6 lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                Diagnostic Evaluation
              </span>
              <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                Official Skill Assessment Result
              </h2>
              <p className="text-xs text-gray-400">
                Concluded on {assessmentResult?.completionDate || '15 Sep 2026'} &bull; Proctored Baseline
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600">{assessmentResult?.overallScore || 84}%</span>
                <span className="text-xs text-gray-400 block">Overall Proficiency</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/skill-gap')}>
                Detailed Dossier
              </Button>
            </div>
          </div>

          {/* Skill-wise Scores Bar Chart */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Skill-Wise Benchmark Ratings
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assessmentResult?.topicScores || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" domain={[0, 100]} fontSize={11} stroke="var(--color-text-muted)" />
                  <YAxis type="category" dataKey="topic" width={160} fontSize={11} stroke="var(--color-text-muted)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                  <Bar dataKey="score" fill="var(--color-secondary, #2563eb)" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cadre Strengths
              </span>
              <ul className="text-xs space-y-1 text-emerald-900 dark:text-emerald-200">
                {assessmentResult?.strengths?.map((s, i) => (
                  <li key={i}>&bull; {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Recommended for Improvement
              </span>
              <ul className="text-xs space-y-1 text-amber-900 dark:text-amber-200">
                {assessmentResult?.gaps?.map((g, i) => (
                  <li key={i}>&bull; {g}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Skill Gap Analysis Quick Card */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
                Skill Gap Matrix
              </h3>
              <Badge variant="info">Ministry Benchmark</Badge>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Current competency index vs. mandatory SSS/ISS cadre standards.
            </p>

            <div className="space-y-3.5">
              {skillGaps.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span style={{ color: 'var(--color-text-primary)' }}>{item.skill}</span>
                    <Badge variant={item.priority === 'High' ? 'error' : item.priority === 'Medium' ? 'warning' : 'success'}>
                      {item.gap > 0 ? `-${item.gap}% Gap` : 'Benchmark Met'}
                    </Badge>
                  </div>
                  <ProgressBar value={item.current} max={100} color={item.gap > 0 ? '#f59e0b' : '#10b981'} />
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-6"
            icon={ArrowRight}
            onClick={() => navigate('/skill-gap')}
          >
            Launch Full Gap Report
          </Button>
        </Card>
      </div>

      {/* ================= E. RECOMMENDED iGOT KARMAYOGI COURSES (SLIDING CAROUSEL) ================= */}
      <SliderTrack
        title="Official iGOT Karmayogi Courses & Progress"
        badge="Accredited Modules"
        subtitle="Swipe to browse official capacity courses verified by MoSPI NASA"
        scrollAmount={340}
        rightAction={
          <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
            Explore Full Catalog <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        }
      >
        {igotCourses.map((c) => (
          <Card key={c.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow min-w-[280px] sm:min-w-[320px] max-w-[340px] flex-shrink-0">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge variant={c.level === 'Advanced' ? 'error' : c.level === 'Intermediate' ? 'warning' : 'info'}>
                  {c.level}
                </Badge>
                <button
                  onClick={() => toggleSaveCourse(c.id)}
                  className="p-1 rounded text-gray-400 hover:text-amber-500 transition-colors"
                  title={savedCourses.has(c.id) ? 'Saved' : 'Save Course'}
                >
                  <Bookmark className={`w-4 h-4 ${savedCourses.has(c.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>
              </div>

              <h3 className="font-bold text-sm line-clamp-2 leading-snug" style={{ color: 'var(--color-text-primary)' }}>
                {c.title}
              </h3>
              <p className="text-xs line-clamp-2 text-gray-400 leading-relaxed">
                {c.description}
              </p>

              <div className="text-[11px] text-gray-500 pt-1 space-y-1">
                <p className="truncate"><strong>Provider:</strong> {c.provider}</p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.duration}</span>
                  <span>&bull;</span>
                  <span>{c.category}</span>
                </div>
              </div>

              {c.progress > 0 && (
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>Progress</span>
                    <span>{c.progress}%</span>
                  </div>
                  <ProgressBar value={c.progress} max={100} />
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t flex items-center justify-between gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm flex-1 no-underline flex items-center justify-center gap-1.5 text-xs font-semibold"
              >
                Start Course <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        ))}
      </SliderTrack>


      {/* ================= F. MY LEARNING & G. ASSESSMENTS TABS ================= */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-6" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              My Learning Dossier
            </h2>
            <p className="text-xs text-gray-400">
              Track course progression, completed qualifications, and pending milestones.
            </p>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Courses' },
              { id: 'in-progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
              { id: 'saved', label: 'Saved' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveLearningTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeLearningTab === tab.id
                    ? 'bg-blue-900 text-white font-bold'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {filteredCourses.map((c) => (
            <div key={c.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{c.title}</h3>
                  <Badge variant={c.status === 'Completed' ? 'success' : c.status === 'In Progress' ? 'warning' : 'neutral'}>
                    {c.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">{c.provider} &bull; {c.duration}</p>
                <div className="w-full max-w-md pt-1">
                  <ProgressBar value={c.progress} max={100} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm text-xs font-semibold no-underline"
                >
                  {c.progress > 0 ? 'Continue' : 'Start'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ================= J. TASKS AND MEETINGS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <CheckSquare className="w-4 h-4 text-blue-600" /> Assigned Tasks & Actions
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {tasks.map(t => (
              <div key={t.id} className="p-3.5 rounded-lg border flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <div className="space-y-1">
                  <p className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>{t.title}</p>
                  <p className="text-gray-400">Due: {t.dueDate} &bull; Priority: {t.priority}</p>
                </div>
                <Badge variant={t.priority === 'High' ? 'error' : 'warning'}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <Calendar className="w-4 h-4 text-blue-600" /> Upcoming Review Meetings
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/meetings')}>
              View Calendar
            </Button>
          </div>

          <div className="space-y-3">
            {meetings.map(m => (
              <div key={m._id || m.id} className="p-3.5 rounded-lg border flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <div className="space-y-1">
                  <p className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>{m.title}</p>
                  <p className="text-gray-400">{m.date} at {m.time}</p>
                </div>
                <a
                  href={m.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm no-underline text-xs font-semibold flex items-center gap-1"
                >
                  Join Meeting <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ================= M. WEEKLY REPORT GENERATION ================= */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/40 border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Weekly Learning & Cadre Progress Report
            </h3>
            <p className="text-xs text-gray-500 max-w-xl">
              Consolidated weekly summary including official learning hours (14h), assessment score (84%), 2 meetings attended, and iGOT modules completed.
            </p>
          </div>

          <Button
            variant="outline"
            icon={Download}
            onClick={() => {
              const csvData = "Metric,Value\nOfficer Name," + (user?.name || "Rajesh Sharma") + "\nOverall Skill Score,84%\nLearning Hours,14 Hours\nCompleted Courses,4\nTasks Done,3\nMeetings Attended,2\n";
              const blob = new Blob([csvData], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = "MoSPI_Weekly_Learning_Report_Week38.csv";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            Download Weekly Report (CSV)
          </Button>
        </div>
      </Card>
    </div>
  );
}
