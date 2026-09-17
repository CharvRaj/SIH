import { Card, Badge, ProgressBar, Button, EmptyState } from '../components/common/index';
import { BookOpen, CheckCircle, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const courses = [
  { id: 'IGOT-DA-101', title: 'Data Analytics Fundamentals', provider: 'iGOT Karmayogi', duration: '8 hours', category: 'Data Analysis', difficulty: 'Beginner', progress: 35, status: 'in_progress', reason: 'Recommended based on Data Analysis skill gap' },
  { id: 'IGOT-SM-201', title: 'Statistical Methods for Governance', provider: 'iGOT Karmayogi', duration: '12 hours', category: 'Statistics', difficulty: 'Intermediate', progress: 0, status: 'not_started', reason: 'Recommended based on Statistical Methods skill gap' },
  { id: 'IGOT-DL-103', title: 'Digital Literacy for Government Officials', provider: 'iGOT Karmayogi', duration: '6 hours', category: 'Digital Literacy', difficulty: 'Beginner', progress: 0, status: 'not_started', reason: 'Recommended based on Digital Literacy skill gap' },
  { id: 'IGOT-RM-202', title: 'Research Methodology Essentials', provider: 'iGOT Karmayogi', duration: '10 hours', category: 'Research', difficulty: 'Intermediate', progress: 0, status: 'not_started', reason: 'Recommended based on Research Methods skill gap' },
];

export default function LearningPathPage() {
  const navigate = useNavigate();
  const completed = courses.filter(c => c.progress === 100).length;
  const overall = courses.length > 0 ? Math.round(courses.reduce((a, c) => a + c.progress, 0) / courses.length) : 0;

  return (
    <div className="container-custom py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>Learning Path</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Personalized course recommendations based on your skill gaps</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/courses')}>Browse All Courses</Button>
      </div>

      {/* Progress Overview */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Overall Progress</h3>
          <span className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>{overall}%</span>
        </div>
        <ProgressBar value={overall} className="mb-3" />
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{completed} of {courses.length} courses completed</p>
      </Card>

      {/* Course List */}
      <div className="space-y-4">
        {courses.map((course, i) => (
          <Card key={i} className="p-5" hover>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-info-bg)' }}>
                <BookOpen className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{course.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="info">{course.category}</Badge>
                      <Badge variant="neutral">{course.difficulty}</Badge>
                      <Badge variant="neutral">{course.duration}</Badge>
                    </div>
                  </div>
                  <Badge variant={course.progress === 100 ? 'success' : course.progress > 0 ? 'warning' : 'neutral'}>
                    {course.progress === 100 ? 'Completed' : course.progress > 0 ? 'In Progress' : 'Not Started'}
                  </Badge>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  {course.reason}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1">
                    <ProgressBar value={course.progress} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{course.progress}%</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="font-medium">Course ID:</span> {course.id} • <span className="font-medium">Provider:</span> {course.provider}
                  </span>
                  <Badge variant="warning" className="text-[10px]">Demo Data</Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
