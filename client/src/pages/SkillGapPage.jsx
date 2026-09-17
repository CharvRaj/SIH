import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Button, ProgressBar, Badge } from '../components/common/index';
import { BarChart3, Target, TrendingUp, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const skillData = [
  { skill: 'Data Analysis', current: 72, required: 90 },
  { skill: 'Statistical Methods', current: 65, required: 85 },
  { skill: 'Policy Framework', current: 80, required: 80 },
  { skill: 'Digital Literacy', current: 55, required: 75 },
  { skill: 'Communication', current: 85, required: 80 },
  { skill: 'Research Methods', current: 60, required: 70 },
];

const radarData = skillData.map(s => ({ subject: s.skill, current: s.current, required: s.required }));

export default function SkillGapPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const overallGap = Math.round(skillData.reduce((a, s) => a + Math.max(0, s.required - s.current), 0) / skillData.length);
  const strengths = skillData.filter(s => s.current >= s.required);
  const gaps = skillData.filter(s => s.current < s.required);

  return (
    <div className="container-custom py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>Skill Gap Report</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Based on your latest assessment results</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/learning-path')}>View Learning Path <ArrowRight className="w-4 h-4" /></Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-5 text-center">
          <Target className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--color-secondary)' }} />
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{overallGap}%</div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Average Skill Gap</div>
        </Card>
        <Card className="p-5 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--color-success)' }} />
          <div className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{strengths.length}</div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Strengths</div>
        </Card>
        <Card className="p-5 text-center">
          <AlertCircle className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--color-warning)' }} />
          <div className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>{gaps.length}</div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Improvement Areas</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Radar Chart */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Skill Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
              <Radar name="Current" dataKey="current" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
              <Radar name="Required" dataKey="required" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Current vs Required Level</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
              <YAxis dataKey="skill" type="category" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} width={120} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="current" fill="#2563eb" name="Current" radius={[0, 4, 4, 0]} />
              <Bar dataKey="required" fill="#f59e0b" name="Required" radius={[0, 4, 4, 0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Skill Details */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Detailed Skill Analysis</h3>
        <div className="space-y-4">
          {skillData.map((s, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{s.skill}</span>
                <Badge variant={s.current >= s.required ? 'success' : 'warning'}>
                  {s.current >= s.required ? 'Met' : `Gap: ${s.required - s.current}%`}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs w-16" style={{ color: 'var(--color-text-muted)' }}>Current</span>
                <div className="flex-1"><ProgressBar value={s.current} color={s.current >= s.required ? 'var(--color-success)' : 'var(--color-secondary)'} /></div>
                <span className="text-xs w-8 text-right font-medium" style={{ color: 'var(--color-text-primary)' }}>{s.current}%</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs w-16" style={{ color: 'var(--color-text-muted)' }}>Required</span>
                <div className="flex-1"><ProgressBar value={s.required} color="var(--color-warning)" /></div>
                <span className="text-xs w-8 text-right font-medium" style={{ color: 'var(--color-text-muted)' }}>{s.required}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
