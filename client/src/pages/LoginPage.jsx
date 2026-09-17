import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, error: authError, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = t('common.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('common.invalidEmail');
    if (!form.password) errs.password = t('common.required');
    else if (form.password.length < 6) errs.password = t('common.passwordMin');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      const path = data.user.role === 'admin' ? '/admin/dashboard' : data.user.role === 'hr' ? '/hr/dashboard' : '/employee/dashboard';
      navigate(path);
    } catch {
      // error is set in auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--color-btn-primary)' }}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>{t('auth.loginTitle')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('auth.loginSubtitle')}</p>
        </div>

        <div className="card p-6 md:p-8">
          {authError && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid var(--color-error-border)' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="label">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="name@organization.gov.in"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">{t('auth.password')}</label>
                <Link to="/forgot-password" className="text-xs font-medium no-underline" style={{ color: 'var(--color-secondary)' }}>
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />}
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('auth.signingIn')}</> : t('auth.signIn')}
            </button>
          </form>

          {/* Quick Demo Logins for Instant Evaluation */}
          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-xs font-semibold text-center uppercase tracking-wider mb-2.5" style={{ color: 'var(--color-text-muted)' }}>
              ⚡ Quick Demo Persona Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm text-xs py-1.5 px-2 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                onClick={async () => {
                  setForm({ email: 'rajesh.sharma@mospi.gov.in', password: 'Officer@123' });
                  try {
                    await login('rajesh.sharma@mospi.gov.in', 'Officer@123');
                  } catch {}
                  navigate('/employee/dashboard');
                }}
              >
                Officer
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm text-xs py-1.5 px-2 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                onClick={async () => {
                  setForm({ email: 'hr@mospi.gov.in', password: 'Hr@123' });
                  try {
                    await login('hr@mospi.gov.in', 'Hr@123');
                  } catch {}
                  navigate('/hr/dashboard');
                }}
              >
                HR Admin
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm text-xs py-1.5 px-2 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                onClick={async () => {
                  setForm({ email: 'admin@mospi.gov.in', password: 'Admin@123' });
                  try {
                    await login('admin@mospi.gov.in', 'Admin@123');
                  } catch {}
                  navigate('/admin/dashboard');
                }}
              >
                Super Admin
              </button>
            </div>
          </div>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--color-text-muted)' }}>
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-medium no-underline" style={{ color: 'var(--color-secondary)' }}>
              {t('auth.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
