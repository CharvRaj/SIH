import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Hash, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register, error: authError, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', employeeId: '', password: '', confirmPassword: '', invitationToken: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t('common.required');
    if (!form.email) errs.email = t('common.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('common.invalidEmail');
    if (!form.employeeId.trim()) errs.employeeId = t('common.required');
    if (!form.password) errs.password = t('common.required');
    else if (form.password.length < 8) errs.password = t('common.passwordMin');
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      navigate('/onboarding');
    } catch {
      // error set in context
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--color-btn-primary)' }}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>{t('auth.registerTitle')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('auth.registerSubtitle')}</p>
        </div>

        <div className="card p-6 md:p-8">
          {authError && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid var(--color-error-border)' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="label">{t('auth.fullName')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input type="text" className={`input pl-10 ${errors.name ? 'input-error' : ''}`} placeholder="Full Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              </div>
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="label">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input type="email" className={`input pl-10 ${errors.email ? 'input-error' : ''}`} placeholder="name@organization.gov.in" value={form.email} onChange={(e) => updateField('email', e.target.value)} autoComplete="email" />
              </div>
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="label">{t('auth.employeeId')}</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input type="text" className={`input pl-10 ${errors.employeeId ? 'input-error' : ''}`} placeholder="EMP-XXXX" value={form.employeeId} onChange={(e) => updateField('employeeId', e.target.value)} />
              </div>
              {errors.employeeId && <p className="error-message">{errors.employeeId}</p>}
            </div>

            <div className="form-group">
              <label className="label">{t('auth.invitationToken')} <span className="text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>(if provided)</span></label>
              <input type="text" className="input" placeholder="Optional" value={form.invitationToken} onChange={(e) => updateField('invitationToken', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="label">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input type={showPassword ? 'text' : 'password'} className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`} placeholder="••••••••" value={form.password} onChange={(e) => updateField('password', e.target.value)} autoComplete="new-password" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />}
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label className="label">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input type="password" className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`} placeholder="••••••••" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} autoComplete="new-password" />
              </div>
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('auth.creatingAccount')}</> : t('auth.signUp')}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--color-text-muted)' }}>
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-medium no-underline" style={{ color: 'var(--color-secondary)' }}>{t('auth.signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
