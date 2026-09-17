import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { StatCard, Card, Modal, EmptyState, PageLoader, DataTable, Badge, SearchBar, Button, FileUpload, SliderTrack } from '../components/common/index';

import {
  Users, UserPlus, Upload, Brain, BookOpen, CalendarCheck, ListTodo, Star,
  BarChart3, FileText, Plus, Download, ArrowRight, TrendingUp, Loader2
} from 'lucide-react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function HRDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', employeeId: '', phone: '', department: '', branch: '', designation: '', joiningDate: '', employmentType: 'permanent', experience: '', education: '', technologies: '', skills: '', responsibilities: '', reportingManager: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const SEEDED_OFFICERS = [
    { _id: 'e-1', fullName: 'Shri Rajesh Sharma', employeeId: 'EMP-2024-080', cadre: 'SSS', designation: 'Senior Statistical Officer (SSO)', division: 'Field Operations Division (FOD)', subOffice: 'Regional Office, Jaipur', email: 'rajesh.sharma@mospi.gov.in', status: 'active', skills: [{ name: 'Survey Sampling', currentScore: 85 }], progress: { overallPercentage: 76 } },
    { _id: 'e-2', fullName: 'Dr. Priya Patel', employeeId: 'EMP-2024-081', cadre: 'ISS', designation: 'Assistant Director', division: 'National Accounts Division (NAD)', subOffice: 'HQ, New Delhi', email: 'priya.patel@mospi.gov.in', status: 'active', skills: [{ name: 'GVA Compilation', currentScore: 92 }], progress: { overallPercentage: 88 } },
    { _id: 'e-3', fullName: 'Shri Amit Kumar Meena', employeeId: 'EMP-2024-082', cadre: 'SSS', designation: 'Junior Statistical Officer (JSO)', division: 'Field Operations Division (FOD)', subOffice: 'SRO Ajmer, Rajasthan', email: 'amit.meena@mospi.gov.in', status: 'active', skills: [{ name: 'CAPI Field Protocols', currentScore: 80 }], progress: { overallPercentage: 62 } },
    { _id: 'e-4', fullName: 'Smt. Kavita Deshmukh', employeeId: 'EMP-2024-083', cadre: 'ISS', designation: 'Deputy Director', division: 'Economic Statistics Division (ESD)', subOffice: 'New Delhi HQ', email: 'kavita.deshmukh@mospi.gov.in', status: 'active', skills: [{ name: 'IIP / ASI Statistics', currentScore: 94 }], progress: { overallPercentage: 92 } },
    { _id: 'e-5', fullName: 'Shri Arvind Swaminathan', employeeId: 'EMP-2024-084', cadre: 'ISS', designation: 'Joint Director', division: 'Survey Design & Research (SDRD)', subOffice: 'Mahalanobis Bhavan, Kolkata', email: 'arvind.swami@mospi.gov.in', status: 'active', skills: [{ name: 'Sampling Variance', currentScore: 96 }], progress: { overallPercentage: 95 } },
    { _id: 'e-6', fullName: 'Smt. Meenakshi Sundaram', employeeId: 'EMP-2024-085', cadre: 'SSS', designation: 'Senior Statistical Officer (SSO)', division: 'Price Statistics Division (PSD)', subOffice: 'RO Chennai, Tamil Nadu', email: 'meenakshi.s@mospi.gov.in', status: 'active', skills: [{ name: 'CPI Computation', currentScore: 92 }], progress: { overallPercentage: 81 } },
    { _id: 'e-7', fullName: 'Shri Aniket Mukherjee', employeeId: 'EMP-2024-086', cadre: 'SSS', designation: 'Junior Statistical Officer (JSO)', division: 'Coordination & Publication (CPD)', subOffice: 'New Delhi HQ', email: 'aniket.m@mospi.gov.in', status: 'probation', skills: [{ name: 'Yearbook Publication', currentScore: 72 }], progress: { overallPercentage: 45 } },
    { _id: 'e-8', fullName: 'Dr. Suresh Chandra Joshi', employeeId: 'EMP-2024-087', cadre: 'ISS', designation: 'Director', division: 'Training Academy (NASA)', subOffice: 'Greater Noida Campus, UP', email: 'suresh.joshi@mospi.gov.in', status: 'active', skills: [{ name: 'UN-SDG Standards', currentScore: 98 }], progress: { overallPercentage: 98 } }
  ];

  const departmentData = [
    { name: 'Field Operations (FOD)', count: 42 },
    { name: 'National Accounts (NAD)', count: 28 },
    { name: 'Economic Statistics (ESD)', count: 24 },
    { name: 'Survey Design (SDRD)', count: 18 },
    { name: 'Training Academy (NASA)', count: 16 },
    { name: 'Price Statistics (PSD)', count: 14 }
  ];

  const assessmentData = [
    { name: 'Completed', value: 72 },
    { name: 'In Progress', value: 18 },
    { name: 'Pending Initial', value: 10 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      let storedMeetingsCount = 3;
      try {
        const meetingsRes = await api.get('/meetings');
        if (meetingsRes.data && meetingsRes.data.data) {
          storedMeetingsCount = meetingsRes.data.data.length;
        } else {
          storedMeetingsCount = 2; // Default seeded amount
        }
      } catch (e) {
        console.error('Failed to fetch meetings for stats', e);
      }

      try {
        const empRes = await api.get('/employees');
        const list = empRes.data.data || empRes.data.employees || [];
        setEmployees(list.length > 0 ? list : SEEDED_OFFICERS);
        setStats({
          totalEmployees: list.length > 0 ? list.length : 8,
          activeEmployees: 7,
          departments: 6,
          assessmentsCompleted: 7,
          avgSkillGap: 8.4,
          coursesInProgress: 12,
          upcomingMeetings: storedMeetingsCount,
          pendingTasks: 5
        });
      } catch {
        setEmployees(SEEDED_OFFICERS);
        setStats({
          totalEmployees: 8,
          activeEmployees: 7,
          departments: 6,
          assessmentsCompleted: 7,
          avgSkillGap: 8.4,
          coursesInProgress: 12,
          upcomingMeetings: storedMeetingsCount,
          pendingTasks: 5
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    if (!addForm.name || !addForm.email || !addForm.employeeId) {
      setAddError('Name, Email and Employee ID are required.');
      return;
    }
    setAddLoading(true);
    try {
      await api.post('/employees', addForm);
      setAddSuccess('Employee added successfully!');
      setAddForm({ name: '', email: '', employeeId: '', phone: '', department: '', branch: '', designation: '', joiningDate: '', employmentType: 'permanent', experience: '', education: '', technologies: '', skills: '', responsibilities: '', reportingManager: '' });
      setTimeout(() => { setShowAddModal(false); setAddSuccess(''); }, 1500);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add employee.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleImportUpload = (file) => {
    setImportFile(file);
    // Simulate import preview
    setImportPreview({
      totalRows: 25,
      validRows: 22,
      errorRows: 3,
      columns: ['Name', 'Email', 'Employee ID', 'Department', 'Designation'],
      errors: [
        { row: 5, message: 'Missing email address' },
        { row: 12, message: 'Duplicate Employee ID: EMP-1042' },
        { row: 19, message: 'Invalid department name' },
      ],
    });
  };

  const handleImportSubmit = async () => {
    setImportLoading(true);
    try {
      // Simulate import
      await new Promise(resolve => setTimeout(resolve, 2000));
      setImportResult({ imported: 22, skipped: 3, errors: 3, total: 25 });
    } catch (err) {
      setImportResult({ error: 'Import failed. Please try again.' });
    } finally {
      setImportLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'Name,Email,Employee ID,Phone,Department,Branch,Designation,Joining Date,Employment Type,Experience,Education\nJohn Doe,john@org.gov.in,EMP-001,9876543210,Statistics,Delhi,Analyst,2024-01-15,permanent,3,M.Sc Statistics';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.download = 'employee_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const employeeColumns = [
    { header: 'Name', accessor: 'name', render: (row) => (
      <button onClick={() => navigate(`/hr/employees/${row._id || 'demo'}`)} className="text-sm font-medium hover:underline" style={{ color: 'var(--color-secondary)' }}>
        {row.name || 'Employee'}
      </button>
    )},
    { header: 'Employee ID', accessor: 'employeeId' },
    { header: 'Department', accessor: 'department' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Status', render: (row) => <Badge variant={row.isActive !== false ? 'success' : 'error'}>{row.isActive !== false ? 'Active' : 'Inactive'}</Badge> },
    { header: 'Actions', render: (row) => (
      <button onClick={() => navigate(`/hr/employees/${row._id || 'demo'}`)} className="btn btn-ghost btn-sm">View</button>
    )},
  ];

  const location = useLocation();
  const departmentSectionRef = useRef(null);
  const employeeSectionRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'add-employee') {
      setShowAddModal(true);
    } else if (tab === 'import') {
      setShowImportModal(true);
    } else if (tab === 'departments') {
      departmentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'employees') {
      employeeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.search]);

  if (loading) return <PageLoader />;

  return (
    <div className="container-custom py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>MoSPI HR & Cadre Administration</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Staffing capacity, skill audits, and Mission Karmayogi tracking</p>
        </div>
        <div className="flex gap-2">
          <Button icon={UserPlus} onClick={() => setShowAddModal(true)}>Add Employee</Button>
          <Button variant="outline" icon={Upload} onClick={() => setShowImportModal(true)}>Import CSV/Excel</Button>
        </div>
      </div>

      {/* ================= HR QUICK ACTIONS SLIDER ================= */}
      <SliderTrack
        title="HR Administration Quick Actions"
        badge="Cadre Management"
        subtitle="Swipe to perform rapid personnel operations and reports"
        scrollAmount={340}
      >
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-gradient-to-r from-blue-900 to-indigo-900 text-white min-w-[240px] flex-shrink-0 hover:scale-[1.02] transition-all shadow-sm text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 flex-shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate text-white group-hover:text-amber-300 transition-colors">
              Add New Officer
            </span>
            <span className="text-[11px] text-blue-200 block truncate">
              Register ISS / SSS cadre record
            </span>
          </div>
        </button>

        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Bulk CSV / Excel Import</span>
            <span className="text-[11px] text-gray-400 block truncate">Upload officer roster file</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/ai-learning')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">AI Quiz & MCQ Generator</span>
            <span className="text-[11px] text-gray-400 block truncate">Upload PDF/TXT for assessments</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/skill-gap')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Cadre Skill Gap Dossiers</span>
            <span className="text-[11px] text-gray-400 block truncate">Analyze department deficiencies</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/weekly-reports')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Cadre Weekly Reports</span>
            <span className="text-[11px] text-gray-400 block truncate">Download consolidation PDF</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/meetings')}
          className="flex items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 min-w-[240px] flex-shrink-0 hover:border-blue-500 hover:scale-[1.02] transition-all shadow-sm text-left"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">Schedule Review Meeting</span>
            <span className="text-[11px] text-gray-400 block truncate">Coordination call via NIC</span>
          </div>
        </button>
      </SliderTrack>

      {/* ================= HR STATS CAROUSEL SLIDER ================= */}
      <SliderTrack
        title="Cadre Workforce Key Indicators"
        badge="MoSPI Live Summary"
        subtitle="Swipe to view all cadre metrics"
        scrollAmount={300}
      >
        <div className="min-w-[160px] flex-shrink-0">
          <StatCard label="Total MoSPI Officers" value={stats.totalEmployees || 8} icon={Users} onClick={() => employeeSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        </div>
        <div className="min-w-[160px] flex-shrink-0">
          <StatCard label="Active Cadre" value={stats.activeEmployees || 7} icon={Users} trend="up" trendValue="98%" />
        </div>
        <div className="min-w-[160px] flex-shrink-0">
          <StatCard label="Key Divisions" value={stats.departments || 6} icon={BarChart3} onClick={() => departmentSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        </div>
        <div className="min-w-[160px] flex-shrink-0">
          <StatCard label="Completed Assessments" value={stats.assessmentsCompleted || 7} icon={Brain} onClick={() => window.open('/assessment/history', '_blank')} />
        </div>
        <div className="min-w-[160px] flex-shrink-0">
          <StatCard label="Average Skill Gap" value={`${stats.avgSkillGap || 8.4}%`} icon={TrendingUp} trend="down" trendValue="-2.1%" onClick={() => navigate('/skill-gap')} />
        </div>
        <div className="min-w-[160px] flex-shrink-0">
          <StatCard label="Courses In Progress" value={stats.coursesInProgress || 12} icon={BookOpen} onClick={() => navigate('/courses/progress')} />
        </div>
        <div className="min-w-[160px] flex-shrink-0">
          <StatCard label="Scrutiny Reviews" value={stats.upcomingMeetings || 3} icon={CalendarCheck} onClick={() => navigate('/meetings')} />
        </div>
        <div className="min-w-[160px] flex-shrink-0">
          <StatCard label="Cadre Deliverables" value={stats.pendingTasks || 5} icon={ListTodo} onClick={() => navigate('/tasks')} />
        </div>
      </SliderTrack>

      {/* Charts */}
      <div ref={departmentSectionRef} className="grid md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Department Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Assessment Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={assessmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                {assessmentData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Employee Table */}
      <div ref={employeeSectionRef}>
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Official Cadre Officers Directory</h3>
              <p className="text-xs text-gray-400">Indian Statistical Service (ISS) & Subordinate Statistical Service (SSS)</p>
            </div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search officers..." className="sm:w-64" />
          </div>
          <DataTable
            columns={employeeColumns}
            data={employees.filter(e => !searchQuery || (e.fullName || e.name)?.toLowerCase().includes(searchQuery.toLowerCase()) || e.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) || e.division?.toLowerCase().includes(searchQuery.toLowerCase()))}
            emptyTitle="No Employees Found"
            emptyMessage="Add employees individually or import via CSV/Excel."
          />
        </Card>
      </div>


      {/* Add Employee Modal */}
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setAddError(''); setAddSuccess(''); }} title="Add Single Employee" size="lg"
        footer={<>
          <Button variant="outline" onClick={() => setShowAddModal(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleAddEmployee} loading={addLoading}>{t('common.save')}</Button>
        </>}
      >
        {addError && <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)' }}>{addError}</div>}
        {addSuccess && <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>{addSuccess}</div>}
        <form onSubmit={handleAddEmployee} className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Full Name *', key: 'name', type: 'text' },
            { label: 'Official Email *', key: 'email', type: 'email' },
            { label: 'Employee ID *', key: 'employeeId', type: 'text' },
            { label: 'Phone', key: 'phone', type: 'tel' },
            { label: 'Department', key: 'department', type: 'text' },
            { label: 'Branch', key: 'branch', type: 'text' },
            { label: 'Designation', key: 'designation', type: 'text' },
            { label: 'Joining Date', key: 'joiningDate', type: 'date' },
            { label: 'Experience (years)', key: 'experience', type: 'number' },
            { label: 'Education', key: 'education', type: 'text' },
            { label: 'Technologies', key: 'technologies', type: 'text' },
            { label: 'Reporting Manager', key: 'reportingManager', type: 'text' },
          ].map((f) => (
            <div key={f.key} className="form-group mb-0">
              <label className="label">{f.label}</label>
              <input type={f.type} className="input" value={addForm[f.key]} onChange={(e) => setAddForm({ ...addForm, [f.key]: e.target.value })} />
            </div>
          ))}
          <div className="md:col-span-2 form-group mb-0">
            <label className="label">Skills (comma-separated)</label>
            <input type="text" className="input" value={addForm.skills} onChange={(e) => setAddForm({ ...addForm, skills: e.target.value })} placeholder="e.g., Data Analysis, Python, SQL" />
          </div>
          <div className="md:col-span-2 form-group mb-0">
            <label className="label">Responsibilities</label>
            <textarea className="textarea" rows={2} value={addForm.responsibilities} onChange={(e) => setAddForm({ ...addForm, responsibilities: e.target.value })} />
          </div>
        </form>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={showImportModal} onClose={() => { setShowImportModal(false); setImportFile(null); setImportPreview(null); setImportResult(null); }} title="Import Employees (CSV / Excel)" size="lg"
        footer={importPreview && !importResult ? <>
          <Button variant="outline" onClick={() => { setImportFile(null); setImportPreview(null); }}>Reset</Button>
          <Button onClick={handleImportSubmit} loading={importLoading}>Import {importPreview.validRows} Employees</Button>
        </> : null}
      >
        {!importFile && (
          <div className="space-y-4">
            <Button variant="outline" icon={Download} onClick={downloadTemplate} size="sm">Download Sample Template</Button>
            <FileUpload
              accept=".csv,.xlsx,.xls"
              maxSize={10 * 1024 * 1024}
              onUpload={handleImportUpload}
              label="Upload CSV or Excel file"
            />
          </div>
        )}

        {importPreview && !importResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{importPreview.totalRows}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total Rows</div>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-success-bg)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{importPreview.validRows}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Valid</div>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-error-bg)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--color-error)' }}>{importPreview.errorRows}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Errors</div>
              </div>
            </div>

            {importPreview.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-error)' }}>Row Errors</h4>
                <div className="space-y-1">
                  {importPreview.errors.map((err, i) => (
                    <div key={i} className="text-xs p-2 rounded" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)' }}>
                      Row {err.row}: {err.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {importResult && (
          <div className="text-center py-4">
            {importResult.error ? (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)' }}>{importResult.error}</div>
            ) : (
              <>
                <div className="p-3 rounded-full inline-flex mb-3" style={{ backgroundColor: 'var(--color-success-bg)' }}>
                  <CheckCircle className="w-8 h-8" style={{ color: 'var(--color-success)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Import Complete</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {importResult.imported} imported • {importResult.skipped} skipped • {importResult.errors} errors
                </p>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
