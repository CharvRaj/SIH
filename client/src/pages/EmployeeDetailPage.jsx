import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge, ProgressBar, Tabs, DataTable, Modal, EmptyState } from '../components/common/index';
import {
  User, BookOpen, BarChart3, Target, Calendar, CheckSquare, Award,
  FileText, Activity, Settings, ArrowLeft, Mail, Phone, MapPin, Building,
  Download, ShieldCheck, Clock, ExternalLink, Edit3
} from 'lucide-react';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Officer Profile
  const [officer, setOfficer] = useState({
    id: id || 'EMP-2024-089',
    name: 'Shri Rajesh Sharma',
    designation: 'Senior Statistical Officer (SSO)',
    service: 'Subordinate Statistical Service (SSS)',
    batch: '2019 Batch',
    division: 'Field Operations Division (FOD)',
    subOffice: 'Regional Office, Jaipur, Rajasthan',
    email: 'rajesh.sharma.iss@gov.in',
    phone: '+91 98765 43210',
    joiningDate: '2019-07-15',
    status: 'active',
    supervisor: 'Dr. Anita Verma, Joint Director',
    overallProgress: 76,
    avgAssessmentScore: 84
  });

  const tabs = [
    { id: 'overview', label: '1. Overview', icon: User },
    { id: 'assessments', label: '2. Assessments', icon: Award },
    { id: 'skillgap', label: '3. Skill Gap', icon: Target },
    { id: 'learning', label: '4. Learning Path', icon: BookOpen },
    { id: 'weekly', label: '5. Weekly Reports', icon: FileText },
    { id: 'meetings', label: '6. Meetings', icon: Calendar },
    { id: 'tasks', label: '7. Tasks', icon: CheckSquare },
    { id: 'performance', label: '8. APAR / Performance', icon: BarChart3 },
    { id: 'documents', label: '9. Documents', icon: FileText },
    { id: 'activity', label: '10. Activity Log', icon: Activity },
    { id: 'settings', label: '11. Cadre Admin', icon: Settings }
  ];

  return (
    <div className="page-container max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Back button and header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/hr/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-3 hover:underline"
          style={{ color: 'var(--color-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to HR Dashboard
        </button>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-900 text-white flex items-center justify-center text-xl font-bold border-2 border-amber-400">
                {officer.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {officer.name}
                  </h1>
                  <Badge variant="success">Active Cadre</Badge>
                </div>
                <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {officer.designation} &bull; {officer.service} ({officer.batch})
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {officer.division}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {officer.subOffice}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {officer.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <Button variant="outline" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
                Edit Cadre Record
              </Button>
              <Button variant="primary" size="sm" icon={Download} onClick={() => alert('Exporting Officer Dossier (PDF)...')}>
                Export Dossier
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 11 Tabs Bar */}
      <div className="overflow-x-auto pb-2 mb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex space-x-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                  isActive
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>Service Credentials</h3>
            <div className="divide-y text-xs" style={{ borderColor: 'var(--color-border)' }}>
              <div className="py-2.5 flex justify-between"><span className="text-gray-500">Employee ID</span> <span className="font-semibold">{officer.id}</span></div>
              <div className="py-2.5 flex justify-between"><span className="text-gray-500">Cadre Stream</span> <span className="font-semibold">{officer.service}</span></div>
              <div className="py-2.5 flex justify-between"><span className="text-gray-500">Appointment Date</span> <span className="font-semibold">{officer.joiningDate}</span></div>
              <div className="py-2.5 flex justify-between"><span className="text-gray-500">Reporting Officer</span> <span className="font-semibold">{officer.supervisor}</span></div>
              <div className="py-2.5 flex justify-between"><span className="text-gray-500">Official Mobile</span> <span className="font-semibold">{officer.phone}</span></div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 lg:col-span-2">
            <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>Mission Karmayogi Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xs text-gray-500 font-semibold uppercase">Learning Path Completion</span>
                <p className="text-2xl font-bold mt-1 text-blue-600">{officer.overallProgress}%</p>
                <ProgressBar value={officer.overallProgress} max={100} className="mt-2" />
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xs text-gray-500 font-semibold uppercase">Assessment Score Average</span>
                <p className="text-2xl font-bold mt-1 text-emerald-600">{officer.avgAssessmentScore}%</p>
                <p className="text-xs text-gray-400 mt-2">Qualified in 4 of 4 domain benchmarks</p>
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Supervisor Notes</h4>
              <p className="text-xs leading-relaxed text-gray-500">
                Officer demonstrates high field sampling leadership in National Sample Survey round 80 operations.
                Recommended for advanced training in Time Series Econometrics and Computer Assisted Personal Interviewing (CAPI).
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Assessments */}
      {activeTab === 'assessments' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Assessment Results & History</h3>
          <div className="space-y-3">
            {[
              { name: 'MoSPI Baseline Statistical Survey Exam', date: '2026-08-10', score: 88, status: 'Passed' },
              { name: 'National Accounts System & GVA Concepts', date: '2026-07-22', score: 82, status: 'Passed' },
              { name: 'Cyber Security & Government IT Guidelines', date: '2026-05-14', score: 94, status: 'Passed' }
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 border rounded-lg" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{a.name}</h4>
                  <p className="text-xs text-gray-400">Completed on {a.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-emerald-600 mr-3">{a.score}%</span>
                  <Badge variant="success">{a.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 3: Skill Gap */}
      {activeTab === 'skillgap' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Official Competency Gap Evaluation</h3>
          <p className="text-xs text-gray-400 mb-6">Target vs. Assessed Skill Index for Senior Statistical Officer Cadre</p>
          <div className="space-y-4 max-w-2xl">
            {[
              { skill: 'Survey Sampling & Estimation', target: 90, actual: 85 },
              { skill: 'Consumer Price Index Compilation', target: 85, actual: 88 },
              { skill: 'Statistical Computing with Python / R', target: 80, actual: 64 },
              { skill: 'Data Visualization & Geocoding', target: 75, actual: 60 }
            ].map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{s.skill}</span>
                  <span>Current: {s.actual}% / Target: {s.target}%</span>
                </div>
                <ProgressBar value={s.actual} max={100} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 4: Learning Path */}
      {activeTab === 'learning' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>iGOT Karmayogi Enrolled Courses</h3>
          <div className="space-y-3">
            {[
              { title: 'National Statistical Framework in India', progress: 100, status: 'Completed' },
              { title: 'Advanced Survey Sampling Methodologies', progress: 75, status: 'In Progress' },
              { title: 'Public Finance and Macroeconomic Indicators', progress: 30, status: 'In Progress' }
            ].map((c, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-2" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{c.title}</h4>
                  <Badge variant={c.status === 'Completed' ? 'success' : 'info'}>{c.status}</Badge>
                </div>
                <ProgressBar value={c.progress} max={100} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 5: Weekly Reports */}
      {activeTab === 'weekly' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Weekly Submissions</h3>
          <div className="space-y-2">
            {[
              { week: 'Week 37, 2026', submitted: '2026-09-12', status: 'Approved', score: 'A+' },
              { week: 'Week 36, 2026', submitted: '2026-09-05', status: 'Approved', score: 'A' },
              { week: 'Week 35, 2026', submitted: '2026-08-28', status: 'Approved', score: 'A+' }
            ].map((w, i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded-lg text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>{w.week}</span>
                  <span className="text-gray-400 ml-3">Submitted: {w.submitted}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-600">{w.score}</span>
                  <Badge variant="success">{w.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 6: Meetings */}
      {activeTab === 'meetings' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Attendance & Meeting Records</h3>
          <div className="divide-y text-xs" style={{ borderColor: 'var(--color-border)' }}>
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Monthly Field Scrutiny Meeting</p>
                <p className="text-gray-400">Sep 10, 2026 &bull; Online NIC Meet</p>
              </div>
              <Badge variant="success">Attended (100%)</Badge>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>CAPI Tablet Verification Briefing</p>
                <p className="text-gray-400">Aug 25, 2026 &bull; RO Jaipur</p>
              </div>
              <Badge variant="success">Attended (100%)</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 7: Tasks */}
      {activeTab === 'tasks' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Assigned Cadre Tasks</h3>
          <div className="space-y-2">
            {[
              { task: 'Upload field verification sample batch for NSS round 80', due: '2026-09-25', status: 'Pending' },
              { task: 'Complete ethics pledge for digital data collectors', due: '2026-09-18', status: 'Completed' }
            ].map((t, i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded-lg text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <span className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>{t.task}</span>
                <Badge variant={t.status === 'Completed' ? 'success' : 'warning'}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 8: Performance / APAR */}
      {activeTab === 'performance' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>APAR Grading Dossier</h3>
          <p className="text-xs text-gray-400 mb-4">Official Annual Performance Appraisal Records</p>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border mb-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">Cycle 2025-26 APAR Score</span>
              <span className="text-xl font-black text-emerald-600">9.2 / 10.0 (Outstanding)</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Certified by Reporting Authority Dr. Rajiv Kumar, DDG (FOD).</p>
          </div>
        </Card>
      )}

      {/* Tab 9: Documents */}
      {activeTab === 'documents' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Official Records & Certificates</h3>
          <div className="space-y-2 text-xs">
            {[
              { name: 'Cadre Induction Order (SSS-2019-142.pdf)', size: '1.4 MB', date: '2019-07-15' },
              { name: 'iGOT Karmayogi Official Statistics Certificate.pdf', size: '540 KB', date: '2026-08-11' },
              { name: 'Vigilance Clearance Certificate 2025.pdf', size: '320 KB', date: '2025-12-01' }
            ].map((d, i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded-lg" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{d.name}</span>
                  <span className="text-gray-400 ml-2">({d.size} &bull; {d.date})</span>
                </div>
                <Button variant="outline" size="sm" icon={Download} onClick={() => alert(`Downloading ${d.name}`)}>
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 10: Activity Log */}
      {activeTab === 'activity' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>System Audit Trail</h3>
          <div className="space-y-3 text-xs">
            {[
              { action: 'Completed Assessment: MoSPI Baseline Statistical Exam', time: 'Yesterday at 15:42 IST' },
              { action: 'Submitted Weekly Report (Week 37)', time: '2026-09-12 at 18:10 IST' },
              { action: 'Profile update by HR Admin', time: '2026-09-01 at 11:20 IST' }
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded bg-gray-50 dark:bg-gray-800/40">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{log.action}</span>
                <span className="text-gray-400 ml-auto">{log.time}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 11: Settings */}
      {activeTab === 'settings' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Cadre Administrative Controls</h3>
          <p className="text-xs text-gray-400">Admin and HR actions for this employee profile</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => alert('Password reset link sent to registered email.')}>
              Trigger Password Reset
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert('Audit logs exported.')}>
              Download Full Access Logs
            </Button>
            <Button variant="primary" size="sm" onClick={() => alert('Synced latest records with iGOT Karmayogi API.')}>
              Sync with iGOT Karmayogi
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Cadre Details"
      >
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold mb-1">Designation</label>
            <input
              type="text"
              className="input w-full"
              value={officer.designation}
              onChange={(e) => setOfficer({ ...officer, designation: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Division</label>
            <input
              type="text"
              className="input w-full"
              value={officer.division}
              onChange={(e) => setOfficer({ ...officer, division: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Sub Office / Location</label>
            <input
              type="text"
              className="input w-full"
              value={officer.subOffice}
              onChange={(e) => setOfficer({ ...officer, subOffice: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setIsEditModalOpen(false)}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
