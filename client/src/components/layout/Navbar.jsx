import { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useClickOutside, useEscapeKey, useMediaQuery } from '../../hooks';
import {
  Menu, X, Sun, Moon, Monitor, ChevronDown, Globe, Bell, BookOpen,
  ClipboardList, HelpCircle, LogOut, User, LayoutDashboard, Settings, MessageSquare
} from 'lucide-react';

import GovLogo from './GovLogo';

function DropdownMenu({ label, items, isOpen, onToggle, onClose }) {
  const ref = useClickOutside(onClose);
  useEscapeKey(onClose);
  const navigate = useNavigate();

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-[var(--color-bg-tertiary)]"
        style={{ color: 'var(--color-text-secondary)' }}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-56 py-1 card shadow-dropdown z-50 animate-fade-in">
          {items.map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[var(--color-bg-tertiary)]"
              style={{ color: 'var(--color-text-secondary)' }}
              onClick={() => { navigate(item.to); onClose(); }}
            >
              {item.icon && <item.icon className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));
  useEscapeKey(() => setIsOpen(false));

  const themes = [
    { value: 'light', label: t('common.lightMode'), icon: Sun },
    { value: 'dark', label: t('common.darkMode'), icon: Moon },
    { value: 'system', label: t('common.systemMode'), icon: Monitor },
  ];

  const current = themes.find(th => th.value === theme) || themes[0];
  const CurrentIcon = current.icon;

  return (
    <div className="relative" ref={ref}>
      <button
        className="p-2 rounded-md transition-colors hover:bg-[var(--color-bg-tertiary)]"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme"
        title={current.label}
      >
        <CurrentIcon className="w-4.5 h-4.5" style={{ color: 'var(--color-text-muted)' }} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 py-1 card shadow-dropdown z-50 animate-fade-in">
          {themes.map((th) => (
            <button
              key={th.value}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-[var(--color-bg-tertiary)] ${
                theme === th.value ? 'font-medium' : ''
              }`}
              style={{ color: theme === th.value ? 'var(--color-secondary)' : 'var(--color-text-secondary)' }}
              onClick={() => { setTheme(th.value); setIsOpen(false); }}
            >
              <th.icon className="w-4 h-4" />
              {th.label}
              {theme === th.value && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useClickOutside(() => setUserMenuOpen(false));
  useEscapeKey(() => { setMobileMenuOpen(false); setOpenDropdown(null); setUserMenuOpen(false); });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = useCallback((name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  }, []);

  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

  const learningItems = [
    { label: t('nav.igotCourses'), to: '/courses', icon: BookOpen },
    { label: t('nav.recommendedCourses'), to: '/courses/recommended', icon: BookOpen },
    { label: t('nav.learningPath'), to: '/learning-path', icon: BookOpen },
    { label: t('nav.courseProgress'), to: '/courses/progress', icon: BookOpen },
  ];

  const assessmentItems = [
    { label: t('nav.initialAssessment'), to: '/assessment/initial', icon: ClipboardList },
    { label: t('nav.weeklyAssessment'), to: '/assessment/weekly', icon: ClipboardList },
    { label: t('nav.assessmentHistory'), to: '/assessment/history', icon: ClipboardList },
    { label: t('nav.skillGapReport'), to: '/skill-gap', icon: ClipboardList },
  ];

  const resourceItems = [
    { label: t('nav.helpdesk'), to: '/helpdesk', icon: HelpCircle },
    { label: t('nav.faqs'), to: '/faqs', icon: HelpCircle },
    { label: t('nav.announcements'), to: '/announcements', icon: HelpCircle },
    { label: t('nav.downloadReports'), to: '/reports', icon: HelpCircle },
  ];

  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'hr' ? '/hr/dashboard' : '/employee/dashboard';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled ? 'shadow-card' : ''
      }`}
      style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: `1px solid var(--color-border)` }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {/* Official Emblem Logo */}
          <GovLogo />

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-1 ml-8">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-[var(--color-bg-tertiary)] no-underline"
                style={{ color: location.pathname === '/' ? 'var(--color-secondary)' : 'var(--color-text-secondary)' }}
              >
                {t('nav.home')}
              </Link>
              <a
                href="#about"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-[var(--color-bg-tertiary)] no-underline"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t('nav.about')}
              </a>
              <a
                href="#features"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-[var(--color-bg-tertiary)] no-underline"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t('nav.features')}
              </a>
              <DropdownMenu
                label={t('nav.learning')}
                items={learningItems}
                isOpen={openDropdown === 'learning'}
                onToggle={() => toggleDropdown('learning')}
                onClose={closeDropdown}
              />
              <DropdownMenu
                label={t('nav.assessments')}
                items={assessmentItems}
                isOpen={openDropdown === 'assessments'}
                onToggle={() => toggleDropdown('assessments')}
                onClose={closeDropdown}
              />
              <DropdownMenu
                label={t('nav.resources')}
                items={resourceItems}
                isOpen={openDropdown === 'resources'}
                onToggle={() => toggleDropdown('resources')}
                onClose={closeDropdown}
              />
            </nav>
          )}

          {/* Right section */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Notifications bell */}
                <Link to="/notifications" className="relative p-2 rounded-md transition-colors hover:bg-[var(--color-bg-tertiary)]">
                  <Bell className="w-4.5 h-4.5" style={{ color: 'var(--color-text-muted)' }} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold text-white rounded-full" style={{ backgroundColor: 'var(--color-error)' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative ml-1" ref={userMenuRef}>
                  <button
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors hover:bg-[var(--color-bg-tertiary)]"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--color-btn-primary)' }}>
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    {!isMobile && (
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        {user?.name?.split(' ')[0]}
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 py-1 card shadow-dropdown z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
                        <span className="badge badge-info mt-1 text-xs">{user?.role}</span>
                      </div>
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-bg-tertiary)]" style={{ color: 'var(--color-text-secondary)' }}
                        onClick={() => { navigate(dashboardPath); setUserMenuOpen(false); }}>
                        <LayoutDashboard className="w-4 h-4" /> {t('nav.dashboard')}
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-bg-tertiary)]" style={{ color: 'var(--color-text-secondary)' }}
                        onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}>
                        <User className="w-4 h-4" /> {t('nav.profile')}
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-bg-tertiary)]" style={{ color: 'var(--color-text-secondary)' }}
                        onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}>
                        <Settings className="w-4 h-4" /> {t('nav.settings')}
                      </button>
                      <div className="border-t my-1" style={{ borderColor: 'var(--color-border)' }} />
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-bg-tertiary)]" style={{ color: 'var(--color-error)' }}
                        onClick={() => { handleLogout(); setUserMenuOpen(false); }}>
                        <LogOut className="w-4 h-4" /> {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="btn btn-ghost btn-sm no-underline">{t('nav.login')}</Link>
                <Link to="/register" className="btn btn-primary btn-sm no-underline">{t('nav.register')}</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            {isMobile && (
              <button
                className="p-2 rounded-md transition-colors hover:bg-[var(--color-bg-tertiary)] ml-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobile && mobileMenuOpen && (
          <div className="border-t pb-4 animate-slide-down" style={{ borderColor: 'var(--color-border)' }}>
            <nav className="flex flex-col py-2">
              <Link to="/" className="px-4 py-2.5 text-sm font-medium no-underline" style={{ color: 'var(--color-text-secondary)' }}>{t('nav.home')}</Link>
              <a href="#about" className="px-4 py-2.5 text-sm font-medium no-underline" style={{ color: 'var(--color-text-secondary)' }}>{t('nav.about')}</a>
              <a href="#features" className="px-4 py-2.5 text-sm font-medium no-underline" style={{ color: 'var(--color-text-secondary)' }}>{t('nav.features')}</a>

              {/* Mobile dropdowns */}
              <MobileDropdown label={t('nav.learning')} items={learningItems} />
              <MobileDropdown label={t('nav.assessments')} items={assessmentItems} />
              <MobileDropdown label={t('nav.resources')} items={resourceItems} />

              {!isAuthenticated && (
                <div className="flex gap-2 px-4 pt-3">
                  <Link to="/login" className="btn btn-outline btn-sm flex-1 no-underline">{t('nav.login')}</Link>
                  <Link to="/register" className="btn btn-primary btn-sm flex-1 no-underline">{t('nav.register')}</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function MobileDropdown({ label, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium"
        style={{ color: 'var(--color-text-secondary)' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pl-6">
          {items.map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left"
              style={{ color: 'var(--color-text-muted)' }}
              onClick={() => navigate(item.to)}
            >
              {item.icon && <item.icon className="w-3.5 h-3.5" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
