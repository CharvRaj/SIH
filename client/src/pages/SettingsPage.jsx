import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge, Tabs } from '../components/common/index';
import { Settings, Shield, Bell, Globe, User, Server, Save, CheckCircle2, Lock, Key, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [generalForm, setGeneralForm] = useState({
    name: user?.name || 'Officer',
    email: user?.email || 'officer@gov.in',
    phone: '+91 98765 43210',
    language: i18n.language || 'en',
    department: user?.department || 'FOD'
  });

  const [notificationsForm, setNotificationsForm] = useState({
    emailAlerts: true,
    smsAlerts: false,
    weeklyDigest: true,
    assessmentReminders: true
  });

  const [adminConfig, setAdminConfig] = useState({
    igotEndpoint: 'https://api.igotkarmayogi.gov.in/v2/mospi',
    igotApiKey: '••••••••••••••••••••••••',
    syncIntervalHours: 12,
    maintenanceMode: false,
    aiAssessmentStrictness: 'High'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'Profile & Locale', icon: User },
    { id: 'security', label: 'Security & 2FA', icon: Shield },
    { id: 'notifications', label: 'Alert Preferences', icon: Bell },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Ministry System Config', icon: Server }] : [])
  ];

  return (
    <div className="page-container max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span>Portal</span> &bull; <span>Preferences</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1" style={{ color: 'var(--color-text-primary)' }}>
            Settings & Configurations
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Customize your experience, manage official authentication security, and configure system integrations.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Preferences updated successfully!
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Tab 1: General */}
      {activeTab === 'general' && (
        <Card className="p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>Officer Information</h2>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Details registered with MoSPI Cadre Administration.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  className="input w-full"
                  value={generalForm.name}
                  onChange={e => setGeneralForm({ ...generalForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>Government Email</label>
                <input
                  type="email"
                  className="input w-full"
                  value={generalForm.email}
                  disabled
                />
                <span className="text-[11px] text-gray-400">Locked to official NIC domain.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>Primary Contact Mobile</label>
                <input
                  type="text"
                  className="input w-full"
                  value={generalForm.phone}
                  onChange={e => setGeneralForm({ ...generalForm, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>Ministry Division</label>
                <input
                  type="text"
                  className="input w-full"
                  value={generalForm.department}
                  onChange={e => setGeneralForm({ ...generalForm, department: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-base font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Display & Environment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>Portal Language</label>
                  <input
                    type="text"
                    className="input w-full"
                    value="English (Government of India Official Format)"
                    disabled
                  />
                  <span className="text-[11px] text-gray-400">Standardized official language for MoSPI adaptive training.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>Portal Theme</label>
                  <Button variant="outline" type="button" className="w-full justify-start" onClick={toggleTheme}>
                    Current Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'} (Click to Toggle)
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <Button variant="primary" type="submit" icon={Save}>
                Save Preferences
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Security */}
      {activeTab === 'security' && (
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>Authentication & Password</h2>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>NIC / MoSPI password policies require reset every 90 days.</p>
          </div>

          <div className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>Current Password</label>
              <input type="password" placeholder="••••••••" className="input w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>New Password</label>
              <input type="password" placeholder="Minimum 12 characters" className="input w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>Confirm New Password</label>
              <input type="password" placeholder="Re-type new password" className="input w-full" />
            </div>
            <Button variant="primary" size="sm" onClick={() => alert('Password updated in compliance with NIC policy.')}>
              Update Password
            </Button>
          </div>

          <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="text-base font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Two-Factor Authentication (2FA)</h2>
            <p className="text-xs text-gray-400 mb-3">Enforce OTP verification through registered Parichay / Aadhaar mobile number.</p>
            <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Government Parichay Authenticator</p>
                <p className="text-xs text-emerald-600 font-medium">Enabled & Verified</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <Card className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Email & SMS Alerts</h2>

            <div className="space-y-3">
              {[
                { key: 'emailAlerts', title: 'Official Email Circulars', desc: 'Receive newly published Ministry notices and cadre orders.' },
                { key: 'assessmentReminders', title: 'Assessment & Quiz Reminders', desc: 'Alerts 48 hours prior to the close of domain evaluation windows.' },
                { key: 'weeklyDigest', title: 'Weekly Learning Digest', desc: 'Weekly compilation of course progress and action items.' },
                { key: 'smsAlerts', title: 'Urgent SMS Broadcasts', desc: 'Receive critical schedule alerts on your registered phone number.' }
              ].map(item => (
                <label key={item.key} className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40" style={{ borderColor: 'var(--color-border)' }}>
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                    checked={notificationsForm[item.key]}
                    onChange={(e) => setNotificationsForm({ ...notificationsForm, [item.key]: e.target.checked })}
                  />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{item.title}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'var(--color-border)' }}>
              <Button variant="primary" type="submit" icon={Save}>
                Save Alert Settings
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 4: Admin Ministry System Config */}
      {activeTab === 'admin' && (
        <Card className="p-6 space-y-6">
          <div className="border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>iGOT Karmayogi API Integration</h2>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Configure national competency bridge and automated sync parameters.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>API Gateway Endpoint</label>
              <input
                type="text"
                className="input w-full font-mono text-xs"
                value={adminConfig.igotEndpoint}
                onChange={e => setAdminConfig({ ...adminConfig, igotEndpoint: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>Secret Token / Key</label>
              <input
                type="password"
                className="input w-full font-mono text-xs"
                value={adminConfig.igotApiKey}
                onChange={e => setAdminConfig({ ...adminConfig, igotApiKey: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>Sync Interval</label>
                <select
                  className="input w-full"
                  value={adminConfig.syncIntervalHours}
                  onChange={e => setAdminConfig({ ...adminConfig, syncIntervalHours: Number(e.target.value) })}
                >
                  <option value={6}>Every 6 Hours</option>
                  <option value={12}>Every 12 Hours</option>
                  <option value={24}>Daily at 00:00 IST</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>AI Assessment Strictness</label>
                <select
                  className="input w-full"
                  value={adminConfig.aiAssessmentStrictness}
                  onChange={e => setAdminConfig({ ...adminConfig, aiAssessmentStrictness: e.target.value })}
                >
                  <option value="Moderate">Moderate (60% Cut-off)</option>
                  <option value="High">High (75% Cut-off, MoSPI Standard)</option>
                  <option value="Strict">Strict (85% Cut-off + Anti-cheat)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <Button variant="primary" icon={Save} onClick={() => alert('Ministry integration parameters successfully committed.')}>
                Save System Config
              </Button>
              <Button variant="outline" icon={RefreshCw} onClick={() => alert('Triggering instant iGOT Karmayogi batch sync...')}>
                Force Sync Now
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
