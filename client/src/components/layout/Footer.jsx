import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import GovLogo from './GovLogo';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.about'), to: '/#about' },
    { label: t('nav.features'), to: '/#features' },
    { label: t('nav.contact'), to: '/#contact' },
    { label: t('nav.login'), to: '/login' },
    { label: t('nav.register'), to: '/register' },
  ];

  const platformLinks = [
    { label: t('footer.skillAssessment'), to: '/assessment/initial' },
    { label: t('footer.skillGapReport'), to: '/skill-gap' },
    { label: t('footer.learningPath'), to: '/learning-path' },
    { label: t('footer.igotCourses'), to: '/courses' },
    { label: t('footer.weeklyReports'), to: '/weekly-reports' },
    { label: t('footer.employeeDashboard'), to: '/employee/dashboard' },
    { label: t('footer.hrDashboard'), to: '/hr/dashboard' },
    { label: t('footer.adminDashboard'), to: '/admin/dashboard' },
  ];

  const resourceLinks = [
    { label: t('footer.helpdesk'), to: '/helpdesk' },
    { label: t('nav.faqs'), to: '/faqs' },
    { label: t('nav.announcements'), to: '/announcements' },
    { label: t('footer.documentation'), to: '/docs' },
    { label: t('footer.accessibility'), to: '/accessibility' },
    { label: t('footer.systemStatus'), to: '/status' },
  ];

  const legalLinks = [
    { label: t('footer.privacyPolicy'), to: '/privacy' },
    { label: t('footer.termsOfUse'), to: '/terms' },
    { label: t('footer.dataProtection'), to: '/data-protection' },
    { label: t('footer.accessibilityStatement'), to: '/accessibility-statement' },
    { label: t('footer.sitemap'), to: '/sitemap' },
  ];

  return (
    <footer style={{ backgroundColor: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <GovLogo compact={true} />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {t('footer.aboutDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-xs transition-colors hover:text-[var(--color-secondary)] no-underline" style={{ color: 'var(--color-text-muted)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('footer.platform')}</h4>
            <ul className="space-y-2">
              {platformLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-xs transition-colors hover:text-[var(--color-secondary)] no-underline" style={{ color: 'var(--color-text-muted)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('footer.resources')}</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-xs transition-colors hover:text-[var(--color-secondary)] no-underline" style={{ color: 'var(--color-text-muted)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{t('footer.legal')}</h4>
            <ul className="space-y-2">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-xs transition-colors hover:text-[var(--color-secondary)] no-underline" style={{ color: 'var(--color-text-muted)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span className="font-medium">{t('footer.contactEmail')}:</span><br />
                  <span className="italic">{t('footer.configuredInSettings')}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container-custom py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <span>© {year} MOSPI Adaptive Learning Platform</span>
            <span>{t('footer.version')}</span>
            <span>{t('footer.lastUpdated')}: Sept 2024</span>
          </div>
          <p className="text-xs text-center md:text-right" style={{ color: 'var(--color-text-muted)' }}>
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
