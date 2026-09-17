import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge, ProgressBar, Tabs } from '../components/common/index';
import { Award, TrendingUp, BarChart2, Star, CheckCircle2, Download, FileText, Calendar, UserCheck } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const scoreTrends = [
  { quarter: 'Q1 2025', score: 72, benchmark: 70 },
  { quarter: 'Q2 2025', score: 78, benchmark: 72 },
  { quarter: 'Q3 2025', score: 81, benchmark: 75 },
  { quarter: 'Q4 2025', score: 86, benchmark: 75 },
  { quarter: 'Q1 2026', score: 89, benchmark: 78 },
  { quarter: 'Q2 2026', score: 92, benchmark: 80 }
];

const competencyData = [
  { subject: 'Survey Sampling', score: 92, fullMark: 100 },
  { subject: 'National Accounts', score: 85, fullMark: 100 },
  { subject: 'Data Ethics & Security', score: 95, fullMark: 100 },
  { subject: 'Python / R Data Tools', score: 78, fullMark: 100 },
  { subject: 'Price Index Compilation', score: 88, fullMark: 100 },
  { subject: 'Administrative Leadership', score: 82, fullMark: 100 }
];

const aparHistory = [
  {
    year: '2025-2026',
    cycle: 'Annual Performance Appraisal Report (APAR)',
    grading: '9.2 / 10.0',
    category: 'Outstanding',
    reportingOfficer: 'Dr. Rajiv Kumar, DDG (FOD)',
    status: 'Finalized',
    comments: 'Exemplary dedication towards digitizing field survey verification pipelines and mentoring junior officers.'
  },
  {
    year: '2024-2025',
    cycle: 'Annual Performance Appraisal Report (APAR)',
    grading: '8.7 / 10.0',
    category: 'Very Good',
    reportingOfficer: 'Shri A. K. Sharma, Director (NAD)',
    status: 'Finalized',
    comments: 'High technical competence demonstrated during Annual Survey of Industries compilation.'
  }
];

export default function PerformancePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Performance Summary' },
    { id: 'competencies', label: 'Competency Radar' },
    { id: 'apar', label: 'APAR History' }
  ];

  const exportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Quarter,Score,Benchmark\n" +
      scoreTrends.map(e => `${e.quarter},${e.score},${e.benchmark}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "MoSPI_Performance_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span>Portal</span> &bull; <span>Performance & Growth</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1" style={{ color: 'var(--color-text-primary)' }}>
            Cadre Performance & Competency Index
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Continuous assessment metrics, official APAR rating progression, and iGOT learning alignment.
          </p>
        </div>
        <Button variant="outline" icon={Download} onClick={exportReport}>
          Export Performance Dossier
        </Button>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Latest Grade</span>
            <Badge variant="success">Outstanding</Badge>
          </div>
          <p className="text-3xl font-extrabold mt-2 text-emerald-600">9.2 <span className="text-sm font-normal text-gray-500">/ 10</span></p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>APAR Cycle 2025-26</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Assessment Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold mt-2" style={{ color: 'var(--color-text-primary)' }}>89.4%</p>
          <p className="text-xs mt-1 text-emerald-600 font-medium">+14% improvement YoY</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>iGOT Compliance</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold mt-2" style={{ color: 'var(--color-text-primary)' }}>100%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>6 of 6 mandatory courses</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Cadre Standing</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-extrabold mt-2" style={{ color: 'var(--color-text-primary)' }}>Top 5%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Among SSS / ISS Batches</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Quarterly Evaluation Progress
                </h2>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Aggregated scores from domain assessments, weekly logs, and learning paths vs. Ministry benchmarks.
                </p>
              </div>
              <Badge variant="info">Historical</Badge>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrends}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="quarter" stroke="var(--color-text-muted)" fontSize={12} />
                  <YAxis domain={[60, 100]} stroke="var(--color-text-muted)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="score" name="Officer Score" stroke="var(--color-secondary)" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="benchmark" name="Ministry Benchmark" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                Target Competencies
              </h2>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Progress against Mission Karmayogi National Competency Framework.
              </p>

              <div className="space-y-4">
                {competencyData.slice(0, 4).map((c, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span style={{ color: 'var(--color-text-primary)' }}>{c.subject}</span>
                      <span className="text-emerald-600">{c.score}%</span>
                    </div>
                    <ProgressBar value={c.score} max={100} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Next evaluation scheduled: Q3 2026 Review</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Competencies Radar */}
      {activeTab === 'competencies' && (
        <Card className="p-6">
          <div className="max-w-2xl mx-auto text-center mb-6">
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              MoSPI 6-Pillar Skill Wheel
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Multidimensional analysis across official statistical operations, computer-assisted data handling, and public administration ethics.
            </p>
          </div>
          <div className="h-96 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={competencyData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--color-text-primary)" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--color-text-muted)" />
                <Radar name="Officer Competency" dataKey="score" stroke="var(--color-secondary)" fill="var(--color-secondary)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Tab 3: APAR */}
      {activeTab === 'apar' && (
        <div className="space-y-4">
          {aparHistory.map((item, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 mb-4" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      Year {item.year} &mdash; {item.cycle}
                    </h3>
                    <Badge variant="success">{item.category}</Badge>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    Reporting Officer: {item.reportingOfficer}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-emerald-600">{item.grading}</span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 mb-1">
                  <FileText className="w-3.5 h-3.5" /> Appraising Officer Endorsement
                </div>
                <p className="text-sm italic" style={{ color: 'var(--color-text-primary)' }}>
                  "{item.comments}"
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
