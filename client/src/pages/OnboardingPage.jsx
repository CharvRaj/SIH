import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, ProgressBar } from '../components/common/index';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, User, Briefcase, Code, BookOpen } from 'lucide-react';
import api from '../services/api';

const STEPS = [
  { id: 'personal', icon: User },
  { id: 'employment', icon: Briefcase },
  { id: 'skills', icon: Code },
  { id: 'interests', icon: BookOpen },
];

export default function OnboardingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', phone: '', department: '', branch: '', designation: '',
    joiningDate: '', employmentType: 'permanent', experience: '', education: '',
    technologies: '', technicalSkills: '', functionalSkills: '', responsibilities: '',
    learningInterests: '', previousTraining: '', reportingManager: '',
  });

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/employees/profile', form);
      window.open('/assessment/initial', '_blank');
    } catch (err) {
      console.error('Save failed:', err);
      // Allow navigation anyway for demo
      window.open('/assessment/initial', '_blank');
    } finally {
      setLoading(false);
    }
  };

  const checklist = [
    { label: t('onboarding.completeProfile'), done: currentStep >= 3 },
    { label: t('onboarding.addEmployment'), done: currentStep >= 1 },
    { label: t('onboarding.addSkills'), done: currentStep >= 2 },
    { label: t('onboarding.addInterests'), done: currentStep >= 3 },
    { label: t('onboarding.completeAssessment'), done: false },
    { label: t('onboarding.viewSkillGap'), done: false },
    { label: t('onboarding.viewLearningPath'), done: false },
    { label: t('onboarding.reviewNotifications'), done: false },
    { label: t('onboarding.viewMeetings'), done: false },
    { label: t('onboarding.openFirstCourse'), done: false },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0: return (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-group"><label className="label">{t('auth.fullName')}</label><input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
          <div className="form-group"><label className="label">{t('onboarding.phone')}</label><input className="input" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} /></div>
          <div className="form-group"><label className="label">{t('common.department')}</label>
            <select className="select" value={form.department} onChange={(e) => update('department', e.target.value)}>
              <option value="">Select department</option>
              {['Statistics', 'IT', 'Finance', 'HR', 'Administration'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="label">{t('common.branch')}</label><input className="input" value={form.branch} onChange={(e) => update('branch', e.target.value)} placeholder="e.g., Delhi HQ" /></div>
          <div className="form-group"><label className="label">{t('common.designation')}</label><input className="input" value={form.designation} onChange={(e) => update('designation', e.target.value)} /></div>
          <div className="form-group"><label className="label">{t('onboarding.reportingManager')}</label><input className="input" value={form.reportingManager} onChange={(e) => update('reportingManager', e.target.value)} /></div>
        </div>
      );
      case 1: return (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-group"><label className="label">{t('onboarding.joiningDate')}</label><input className="input" type="date" value={form.joiningDate} onChange={(e) => update('joiningDate', e.target.value)} /></div>
          <div className="form-group"><label className="label">{t('onboarding.employmentType')}</label>
            <select className="select" value={form.employmentType} onChange={(e) => update('employmentType', e.target.value)}>
              <option value="permanent">Permanent</option><option value="contractual">Contractual</option><option value="deputation">Deputation</option><option value="temporary">Temporary</option>
            </select>
          </div>
          <div className="form-group"><label className="label">{t('onboarding.experience')}</label><input className="input" type="number" value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="Years" /></div>
          <div className="form-group"><label className="label">{t('onboarding.education')}</label><input className="input" value={form.education} onChange={(e) => update('education', e.target.value)} placeholder="e.g., M.Sc Statistics" /></div>
          <div className="md:col-span-2 form-group"><label className="label">{t('onboarding.responsibilities')}</label><textarea className="textarea" rows={3} value={form.responsibilities} onChange={(e) => update('responsibilities', e.target.value)} /></div>
        </div>
      );
      case 2: return (
        <div className="space-y-4">
          <div className="form-group"><label className="label">{t('onboarding.technologies')}</label><input className="input" value={form.technologies} onChange={(e) => update('technologies', e.target.value)} placeholder="e.g., Python, R, Excel, SPSS" /></div>
          <div className="form-group"><label className="label">{t('onboarding.technicalSkills')}</label><textarea className="textarea" rows={2} value={form.technicalSkills} onChange={(e) => update('technicalSkills', e.target.value)} placeholder="e.g., Data Analysis, Statistical Modeling, Database Management" /></div>
          <div className="form-group"><label className="label">{t('onboarding.functionalSkills')}</label><textarea className="textarea" rows={2} value={form.functionalSkills} onChange={(e) => update('functionalSkills', e.target.value)} placeholder="e.g., Report Writing, Project Management, Communication" /></div>
        </div>
      );
      case 3: return (
        <div className="space-y-4">
          <div className="form-group"><label className="label">{t('onboarding.learningInterests')}</label><textarea className="textarea" rows={3} value={form.learningInterests} onChange={(e) => update('learningInterests', e.target.value)} placeholder="e.g., Advanced Data Analytics, Machine Learning, Policy Analysis" /></div>
          <div className="form-group"><label className="label">{t('onboarding.previousTraining')}</label><textarea className="textarea" rows={2} value={form.previousTraining} onChange={(e) => update('previousTraining', e.target.value)} placeholder="e.g., ISTM Training 2023, Data Science Bootcamp" /></div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="container-custom py-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>{t('onboarding.title')}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('onboarding.subtitle')}</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${i <= currentStep ? '' : 'border'}`}
              style={i <= currentStep ? { backgroundColor: 'var(--color-btn-primary)', color: 'white' } : { borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
              {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
            </div>
            <span className="hidden sm:block text-xs font-medium" style={{ color: i <= currentStep ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
              {t(`onboarding.step${i + 1}`)}
            </span>
            {i < STEPS.length - 1 && <div className="w-8 h-0.5 mx-1" style={{ backgroundColor: i < currentStep ? 'var(--color-btn-primary)' : 'var(--color-border)' }} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-h4 font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            {t(`onboarding.step${currentStep + 1}`)}
          </h2>
          {renderStep()}
          <div className="flex justify-between mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <Button variant="outline" icon={ArrowLeft} onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
              {t('common.previous')}
            </Button>
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                {t('common.next')} <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSave} loading={loading}>
                Save & Continue to Assessment
              </Button>
            )}
          </div>
        </Card>

        {/* Checklist */}
        <Card className="p-5 h-fit">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>{t('onboarding.checklist')}</h3>
          <ProgressBar value={checklist.filter(c => c.done).length} max={checklist.length} className="mb-4" />
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
            {checklist.filter(c => c.done).length} of {checklist.length} completed
          </p>
          <ul className="space-y-2.5">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                {item.done ? <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-success)' }} /> : <Circle className="w-4 h-4" style={{ color: 'var(--color-border)' }} />}
                <span className="text-xs" style={{ color: item.done ? 'var(--color-text-primary)' : 'var(--color-text-muted)', textDecoration: item.done ? 'line-through' : 'none' }}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
