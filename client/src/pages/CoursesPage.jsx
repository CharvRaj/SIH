import { useState } from 'react';
import { Card, Badge, SearchBar, EmptyState, Button, Modal } from '../components/common/index';
import { BookOpen, ExternalLink, Filter, Clock, Award, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const demoCourses = [
  { id: 'IGOT-DA-101', title: 'Data Analytics Fundamentals', provider: 'iGOT Karmayogi', duration: '8 hours', description: 'Introduction to data analytics concepts, tools, and applications in government context.', category: 'Data Analysis', difficulty: 'Beginner', department: 'All', isDemo: true },
  { id: 'IGOT-SM-201', title: 'Statistical Methods for Governance', provider: 'iGOT Karmayogi', duration: '12 hours', description: 'Advanced statistical methods used in policy analysis and governance decision-making.', category: 'Statistics', difficulty: 'Intermediate', department: 'Statistics', isDemo: true },
  { id: 'IGOT-DG-102', title: 'Digital Governance Framework', provider: 'iGOT Karmayogi', duration: '6 hours', description: 'Understanding the framework for digital governance and e-governance initiatives.', category: 'Governance', difficulty: 'Beginner', department: 'All', isDemo: true },
  { id: 'IGOT-PM-301', title: 'Public Policy Management', provider: 'iGOT Karmayogi', duration: '15 hours', description: 'Comprehensive course on public policy formulation, implementation, and evaluation.', category: 'Policy', difficulty: 'Advanced', department: 'Administration', isDemo: true },
  { id: 'IGOT-CS-104', title: 'Cybersecurity Essentials', provider: 'iGOT Karmayogi', duration: '8 hours', description: 'Essential cybersecurity practices for government employees and data protection.', category: 'Technology', difficulty: 'Beginner', department: 'IT', isDemo: true },
];

export default function CoursesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const categories = ['all', ...new Set(demoCourses.map(c => c.category))];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = demoCourses.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.category.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (filterDifficulty !== 'all' && c.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className="container-custom py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>{t('igot.title')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('igot.subtitle')}</p>
        </div>
        <Badge variant="warning">{t('igot.notConfigured')}</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search courses..." className="flex-1 min-w-[200px]" />
        <select className="select w-auto" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
        <select className="select w-auto" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
          {difficulties.map(d => <option key={d} value={d}>{d === 'all' ? 'All Levels' : d}</option>)}
        </select>
      </div>

      {/* Course Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <Card key={course.id} className="p-5 flex flex-col" hover clickable onClick={() => setSelectedCourse(course)}>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-info-bg)' }}>
                  <BookOpen className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                </div>
                {course.isDemo && <Badge variant="warning" className="text-[10px]">{t('igot.demoData')}</Badge>}
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{course.title}</h3>
              <p className="text-xs flex-1 leading-relaxed mb-3" style={{ color: 'var(--color-text-muted)' }}>{course.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge variant="info">{course.category}</Badge>
                <Badge variant="neutral">{course.difficulty}</Badge>
              </div>
              <div className="text-xs space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {course.duration}</div>
                <div className="flex items-center gap-1.5"><Award className="w-3 h-3" /> {course.provider}</div>
                <div className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {course.department}</div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={BookOpen} title={t('igot.noCoursesTitle')} message={t('igot.noCoursesDesc')} />
      )}

      {/* Course Detail Modal */}
      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse?.title} size="md"
        footer={<Button variant="outline" onClick={() => setSelectedCourse(null)}>Close</Button>}
      >
        {selectedCourse && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{selectedCourse.category}</Badge>
              <Badge variant="neutral">{selectedCourse.difficulty}</Badge>
              {selectedCourse.isDemo && <Badge variant="warning">Demo Data</Badge>}
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{selectedCourse.description}</p>
            <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <div><strong>Course ID:</strong> {selectedCourse.id}</div>
              <div><strong>Provider:</strong> {selectedCourse.provider}</div>
              <div><strong>Duration:</strong> {selectedCourse.duration}</div>
              <div><strong>Department:</strong> {selectedCourse.department}</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-warning-bg)' }}>
              <p className="text-xs" style={{ color: 'var(--color-warning)' }}>
                This is demo data. Official course links will be available once iGOT integration is configured by the administrator.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
