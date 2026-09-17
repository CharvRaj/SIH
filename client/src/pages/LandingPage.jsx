import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Accordion, Card, ProgressBar } from '../components/common/index';
import {
  Brain, BarChart3, BookOpen, Route, FileText, LineChart, Users, CalendarCheck,
  ListTodo, Star, MessageSquare, Globe, Bell, Download, ArrowRight, CheckCircle,
  Shield, Target, TrendingUp, Lightbulb, Award, Zap
} from 'lucide-react';

/* ===== HERO SECTION ===== */
function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="section bg-pattern" id="hero">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6" style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)', border: '1px solid var(--color-info-border)' }}>
              <Zap className="w-3.5 h-3.5" /> Government Learning Platform
            </div>
            <h1 className="text-display font-extrabold mb-5" style={{ color: 'var(--color-text-primary)' }}>
              {t('hero.title')}
            </h1>
            <p className="text-body mb-8" style={{ color: 'var(--color-text-muted)', maxWidth: '540px' }}>
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">
                {t('hero.getStarted')} <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/courses')} className="btn btn-outline btn-lg">
                {t('hero.exploreLearning')}
              </button>
              <button onClick={() => navigate('/login')} className="btn btn-ghost btn-lg">
                {t('hero.login')}
              </button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <p className="text-xs text-center mb-3 font-medium" style={{ color: 'var(--color-text-muted)' }}>
              {t('hero.previewLabel')}
            </p>
            <div className="card p-5 space-y-4">
              {/* Mini stat row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <div className="text-lg font-bold" style={{ color: 'var(--color-secondary)' }}>78%</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Skill Score</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <div className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>92%</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Attendance</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <div className="text-lg font-bold" style={{ color: 'var(--color-accent-saffron)' }}>4/6</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Courses</div>
                </div>
              </div>

              {/* Mini bar chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Skill-Gap Analysis</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Current vs Target</span>
                </div>
                <div className="space-y-2">
                  {[
                    { skill: 'Data Analysis', current: 72, target: 90 },
                    { skill: 'Statistical Methods', current: 65, target: 85 },
                    { skill: 'Policy Framework', current: 80, target: 80 },
                    { skill: 'Digital Literacy', current: 55, target: 75 },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs w-28 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{s.skill}</span>
                      <div className="flex-1">
                        <div className="relative h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                          <div className="absolute h-full rounded-full opacity-30" style={{ width: `${s.target}%`, backgroundColor: 'var(--color-secondary)' }} />
                          <div className="absolute h-full rounded-full" style={{ width: `${s.current}%`, backgroundColor: s.current >= s.target ? 'var(--color-success)' : 'var(--color-secondary)' }} />
                        </div>
                      </div>
                      <span className="text-xs font-medium w-8 text-right" style={{ color: 'var(--color-text-muted)' }}>{s.current}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini course card */}
              <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded" style={{ backgroundColor: 'var(--color-info-bg)' }}>
                    <BookOpen className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>Recommended Course</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Data Analytics Fundamentals — iGOT Karmayogi</p>
                    <div className="mt-2">
                      <ProgressBar value={35} />
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>35% complete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== PLATFORM INTRO ===== */
function PlatformIntro() {
  const { t } = useTranslation();
  const items = [
    { icon: TrendingUp, title: t('intro.continuousLearning'), desc: t('intro.continuousLearningDesc') },
    { icon: Target, title: t('intro.competencyGaps'), desc: t('intro.competencyGapsDesc') },
    { icon: Brain, title: t('intro.assessmentGeneration'), desc: t('intro.assessmentGenerationDesc') },
    { icon: Lightbulb, title: t('intro.learningRecommendations'), desc: t('intro.learningRecommendationsDesc') },
    { icon: Users, title: t('intro.hrMonitoring'), desc: t('intro.hrMonitoringDesc') },
    { icon: BarChart3, title: t('intro.adminInsights'), desc: t('intro.adminInsightsDesc') },
  ];

  return (
    <section className="section" style={{ backgroundColor: 'var(--color-bg-secondary)' }} id="about">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('intro.title')}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Card key={i} className="p-6" hover>
              <div className="p-2.5 rounded-lg inline-flex mb-4" style={{ backgroundColor: 'var(--color-info-bg)' }}>
                <item.icon className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
              </div>
              <h3 className="text-h4 font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== HOW IT WORKS ===== */
function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    { num: '01', title: t('howItWorks.step1'), desc: t('howItWorks.step1Desc'), icon: Users },
    { num: '02', title: t('howItWorks.step2'), desc: t('howItWorks.step2Desc'), icon: Brain },
    { num: '03', title: t('howItWorks.step3'), desc: t('howItWorks.step3Desc'), icon: BarChart3 },
    { num: '04', title: t('howItWorks.step4'), desc: t('howItWorks.step4Desc'), icon: BookOpen },
    { num: '05', title: t('howItWorks.step5'), desc: t('howItWorks.step5Desc'), icon: TrendingUp },
  ];

  return (
    <section className="section" id="how-it-works">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('howItWorks.title')}</h2>
          <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>{t('howItWorks.subtitle')}</p>
        </div>
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--color-border)', transform: 'translateY(-50%)' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center relative z-10 mb-4" style={{ backgroundColor: 'var(--color-btn-primary)' }}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold mb-1" style={{ color: 'var(--color-secondary)' }}>STEP {step.num}</span>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{step.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== FEATURES ===== */
function FeaturesSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const features = [
    { icon: Brain, title: t('features.aiAssessment'), desc: t('features.aiAssessmentDesc'), to: '/assessment/initial' },
    { icon: BarChart3, title: t('features.skillGap'), desc: t('features.skillGapDesc'), to: '/skill-gap' },
    { icon: BookOpen, title: t('features.igotCourses'), desc: t('features.igotCoursesDesc'), to: '/courses' },
    { icon: Route, title: t('features.learningPaths'), desc: t('features.learningPathsDesc'), to: '/learning-path' },
    { icon: FileText, title: t('features.weeklyReports'), desc: t('features.weeklyReportsDesc'), to: '/weekly-reports' },
    { icon: LineChart, title: t('features.analytics'), desc: t('features.analyticsDesc'), to: '/employee/dashboard' },
    { icon: Users, title: t('features.hrManagement'), desc: t('features.hrManagementDesc'), to: '/hr/dashboard' },
    { icon: CalendarCheck, title: t('features.meetingAttendance'), desc: t('features.meetingAttendanceDesc'), to: '/meetings' },
    { icon: ListTodo, title: t('features.taskTracking'), desc: t('features.taskTrackingDesc'), to: '/tasks' },
    { icon: Star, title: t('features.performanceReviews'), desc: t('features.performanceReviewsDesc'), to: '/performance' },
    { icon: MessageSquare, title: t('features.chatbot'), desc: t('features.chatbotDesc'), to: '/helpdesk' },
    { icon: Globe, title: t('features.multiLanguage'), desc: t('features.multiLanguageDesc'), to: '/#' },
    { icon: Bell, title: t('features.notifications'), desc: t('features.notificationsDesc'), to: '/notifications' },
    { icon: Download, title: t('features.exportReports'), desc: t('features.exportReportsDesc'), to: '/reports' },
  ];

  return (
    <section className="section" style={{ backgroundColor: 'var(--color-bg-secondary)' }} id="features">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('features.title')}</h2>
          <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>{t('features.subtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <Card key={i} className="p-5 flex flex-col" hover clickable onClick={() => {
              if (f.to.includes('/assessment')) {
                window.open(f.to, '_blank');
              } else {
                navigate(f.to);
              }
            }}>
              <div className="p-2 rounded-lg inline-flex w-fit mb-3" style={{ backgroundColor: 'var(--color-info-bg)' }}>
                <f.icon className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--color-text-muted)' }}>{f.desc}</p>
              <span className="text-xs font-medium mt-3 inline-flex items-center gap-1" style={{ color: 'var(--color-secondary)' }}>
                {t('features.learnMore')} <ArrowRight className="w-3 h-3" />
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== ROLE CARDS ===== */
function RoleCards() {
  const { t } = useTranslation();
  const roles = [
    { title: t('roles.employee'), icon: Users, color: 'var(--color-secondary)', features: Object.values(t('roles.employeeFeatures', { returnObjects: true })) },
    { title: t('roles.hr'), icon: Shield, color: 'var(--color-success)', features: Object.values(t('roles.hrFeatures', { returnObjects: true })) },
    { title: t('roles.admin'), icon: Award, color: 'var(--color-accent-saffron)', features: Object.values(t('roles.adminFeatures', { returnObjects: true })) },
  ];

  return (
    <section className="section" id="roles">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('roles.title')}</h2>
          <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>{t('roles.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <Card key={i} className="p-6" hover>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${role.color}15` }}>
                  <role.icon className="w-6 h-6" style={{ color: role.color }} />
                </div>
                <h3 className="text-h4 font-semibold" style={{ color: 'var(--color-text-primary)' }}>{role.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {role.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: role.color }} />
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== ANALYTICS PREVIEW ===== */
function AnalyticsPreview() {
  const { t } = useTranslation();
  const stats = [
    { label: t('analyticsPreview.employeesEnrolled'), value: '—', icon: Users },
    { label: t('analyticsPreview.assessmentsCompleted'), value: '—', icon: Brain },
    { label: t('analyticsPreview.avgSkillImprovement'), value: '—', icon: TrendingUp },
    { label: t('analyticsPreview.activeLearningPaths'), value: '—', icon: Route },
    { label: t('analyticsPreview.courseCompletion'), value: '—', icon: BookOpen },
    { label: t('analyticsPreview.meetingAttendance'), value: '—', icon: CalendarCheck },
  ];

  return (
    <section className="section" style={{ backgroundColor: 'var(--color-bg-secondary)' }} id="analytics">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-h2 font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('analyticsPreview.title')}</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t('analyticsPreview.subtitle')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="p-4 text-center" hover>
              <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--color-secondary)' }} />
              <div className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
              <span className="badge badge-neutral mt-2 text-[10px]">{t('analyticsPreview.sampleData')}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== iGOT SECTION ===== */
function IGOTSection() {
  const { t } = useTranslation();
  const demoCourses = [
    { title: 'Data Analytics Fundamentals', provider: 'iGOT Karmayogi', duration: '8 hours', id: 'IGOT-DA-101', category: 'Data Analysis', difficulty: 'Beginner' },
    { title: 'Statistical Methods for Governance', provider: 'iGOT Karmayogi', duration: '12 hours', id: 'IGOT-SM-201', category: 'Statistics', difficulty: 'Intermediate' },
    { title: 'Digital Governance Framework', provider: 'iGOT Karmayogi', duration: '6 hours', id: 'IGOT-DG-102', category: 'Governance', difficulty: 'Beginner' },
  ];

  return (
    <section className="section" id="igot">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-h2 font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('igot.title')}</h2>
          <p className="text-sm max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>{t('igot.subtitle')}</p>
          <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: '1px solid var(--color-warning-border)' }}>
            {t('igot.notConfigured')}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {demoCourses.map((course, i) => (
            <Card key={i} className="p-5" hover>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-info-bg)' }}>
                  <BookOpen className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                </div>
                <span className="badge badge-warning text-[10px]">{t('igot.demoData')}</span>
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{course.title}</h3>
              <div className="space-y-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <div><span className="font-medium">{t('igot.provider')}:</span> {course.provider}</div>
                <div><span className="font-medium">{t('igot.duration')}:</span> {course.duration}</div>
                <div><span className="font-medium">{t('igot.courseId')}:</span> {course.id}</div>
                <div><span className="font-medium">{t('igot.skillCategory')}:</span> {course.category}</div>
                <div><span className="font-medium">{t('igot.difficulty')}:</span> {course.difficulty}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== FAQ SECTION ===== */
function FAQSection() {
  const { t } = useTranslation();
  const faqs = Array.from({ length: 10 }, (_, i) => ({
    question: t(`faq.q${i + 1}`),
    answer: t(`faq.a${i + 1}`),
  }));

  return (
    <section className="section" style={{ backgroundColor: 'var(--color-bg-secondary)' }} id="faq">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-h2 font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('faq.title')}</h2>
          <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>{t('faq.subtitle')}</p>
        </div>
        <Accordion items={faqs} />
      </div>
    </section>
  );
}

/* ===== CTA SECTION ===== */
function CTASection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="section" id="cta">
      <div className="container-custom">
        <div className="card p-10 md:p-14 text-center" style={{ background: 'linear-gradient(135deg, var(--color-btn-primary), var(--color-btn-secondary))' }}>
          <h2 className="text-h2 font-bold mb-3 text-white">{t('cta.title')}</h2>
          <p className="text-sm text-white/80 mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate('/register')} className="btn btn-lg bg-white hover:bg-gray-100" style={{ color: 'var(--color-btn-primary)' }}>
              {t('cta.createAccount')}
            </button>
            <button onClick={() => navigate('/login')} className="btn btn-lg border-2 border-white/50 text-white hover:bg-white/10">
              {t('cta.login')}
            </button>
            <button onClick={() => navigate('/courses')} className="btn btn-lg border-2 border-white/50 text-white hover:bg-white/10">
              {t('cta.exploreCourses')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== LANDING PAGE ===== */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <PlatformIntro />
      <HowItWorks />
      <FeaturesSection />
      <RoleCards />
      <AnalyticsPreview />
      <IGOTSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
