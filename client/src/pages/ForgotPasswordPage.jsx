import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError(t('common.required')); return; }
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="p-4 rounded-full inline-flex mb-4" style={{ backgroundColor: 'var(--color-success-bg)' }}>
            <CheckCircle className="w-8 h-8" style={{ color: 'var(--color-success)' }} />
          </div>
          <h1 className="text-h2 font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Check Your Email</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            If an account exists for <strong>{email}</strong>, a password reset link has been sent.
          </p>
          <Link to="/login" className="btn btn-primary no-underline">{t('auth.backToLogin')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>{t('auth.forgotTitle')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('auth.forgotSubtitle')}</p>
        </div>
        <div className="card p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid var(--color-error-border)' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="label">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <input type="email" className="input pl-10" placeholder="name@organization.gov.in" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {t('auth.sendResetLink')}
            </button>
          </form>
          <p className="text-sm text-center mt-6" style={{ color: 'var(--color-text-muted)' }}>
            <Link to="/login" className="font-medium no-underline" style={{ color: 'var(--color-secondary)' }}>{t('auth.backToLogin')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
