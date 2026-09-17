import { useState } from 'react';
import { Loader2, AlertCircle, Inbox, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ===== BUTTON =====
export function Button({ children, variant = 'primary', size = 'md', loading, disabled, className = '', icon: Icon, ...props }) {
  const sizeClass = size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '';
  const variantClass = `btn-${variant}`;
  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
    </button>
  );
}

// ===== CARD =====
export function Card({ children, className = '', hover, clickable, onClick, ...props }) {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${clickable ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

// ===== STAT CARD =====
export function StatCard({ label, value, icon: Icon, trend, trendValue, onClick, loading: isLoading }) {
  if (isLoading) {
    return (
      <div className="stat-card">
        <div className="flex items-center justify-between">
          <div className="skeleton h-10 w-10 rounded-lg" />
          <div className="skeleton h-4 w-16" />
        </div>
        <div className="mt-3">
          <div className="skeleton h-8 w-20" />
          <div className="skeleton h-4 w-32 mt-1" />
        </div>
      </div>
    );
  }
  return (
    <div className="stat-card" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className="flex items-center justify-between">
        {Icon && (
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
            <Icon className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
          </div>
        )}
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            trend === 'up' ? 'badge-success' : trend === 'down' ? 'badge-error' : 'badge-neutral'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

// ===== LOADING SPINNER =====
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClass = size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClass} animate-spin`} style={{ color: 'var(--color-secondary)' }} />
    </div>
  );
}

// ===== PAGE LOADER =====
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto" style={{ color: 'var(--color-secondary)' }} />
        <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      </div>
    </div>
  );
}

// ===== EMPTY STATE =====
export function EmptyState({ icon: Icon = Inbox, title, message, action, actionLabel, className = '' }) {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="p-4 rounded-full" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
        <Icon className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} />
      </div>
      <h3 className="mt-4 text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {title || t('common.noResults')}
      </h3>
      {message && <p className="mt-1 text-sm text-center max-w-md" style={{ color: 'var(--color-text-muted)' }}>{message}</p>}
      {action && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={action}>
          {actionLabel || t('common.retry')}
        </Button>
      )}
    </div>
  );
}

// ===== ERROR STATE =====
export function ErrorState({ title, message, onRetry, className = '' }) {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="p-4 rounded-full" style={{ backgroundColor: 'var(--color-error-bg)' }}>
        <AlertCircle className="w-8 h-8" style={{ color: 'var(--color-error)' }} />
      </div>
      <h3 className="mt-4 text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {title || t('common.error')}
      </h3>
      {message && <p className="mt-1 text-sm text-center max-w-md" style={{ color: 'var(--color-text-muted)' }}>{message}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
}

// ===== MODAL =====
export function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg-modal-overlay)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`card w-full ${sizeClass} max-h-[90vh] flex flex-col animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Close">
              <XCircle className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
            </button>
          </div>
        )}
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--color-border)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== BADGE =====
export function Badge({ children, variant = 'neutral', className = '' }) {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}

// ===== TOAST =====
export function Toast({ type = 'info', message, onClose, duration = 5000 }) {
  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
  const Icon = icons[type] || Info;
  const bgClass = `badge-${type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'}`;

  if (duration > 0) {
    setTimeout(onClose, duration);
  }

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-dropdown animate-slide-up ${bgClass}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 p-0.5 rounded hover:opacity-70">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
}

// ===== TABS =====
export function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`tab-list ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
        >
          {tab.icon && <tab.icon className="w-4 h-4 mr-1.5 inline" />}
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 badge badge-neutral text-xs">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ===== PROGRESS BAR =====
export function ProgressBar({ value, max = 100, className = '', color }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`progress-bar ${className}`}>
      <div
        className="progress-fill"
        style={{ width: `${percentage}%`, ...(color ? { backgroundColor: color } : {}) }}
      />
    </div>
  );
}

// ===== ACCORDION =====
export function Accordion({ items, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(new Set());

  const toggle = (index) => {
    setOpenItems(prev => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
      {items.map((item, index) => (
        <div key={index} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
          <button
            className="w-full flex items-center justify-between py-4 px-1 text-left font-medium transition-colors hover:text-[var(--color-secondary)]"
            style={{ color: 'var(--color-text-primary)' }}
            onClick={() => toggle(index)}
            onKeyDown={(e) => { if (e.key === 'Escape') setOpenItems(new Set()); }}
            aria-expanded={openItems.has(index)}
          >
            <span className="text-sm md:text-base pr-4">{item.question}</span>
            <svg
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openItems.has(index) ? 'rotate-180' : ''}`}
              style={{ color: 'var(--color-text-muted)' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${openItems.has(index) ? 'max-h-96 pb-4' : 'max-h-0'}`}
          >
            <p className="text-sm px-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== SEARCH BAR =====
export function SearchBar({ value, onChange, placeholder, className = '' }) {
  const { t } = useTranslation();
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || t('common.search')}
        className="input pl-10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <XCircle className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
        </button>
      )}
    </div>
  );
}

// ===== PAGINATION =====
export function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {t('common.previous')}
      </button>
      {start > 1 && (
        <>
          <button className="btn btn-ghost btn-sm" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span className="px-1" style={{ color: 'var(--color-text-muted)' }}>...</span>}
        </>
      )}
      {pages.map(p => (
        <button
          key={p}
          className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1" style={{ color: 'var(--color-text-muted)' }}>...</span>}
          <button className="btn btn-ghost btn-sm" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {t('common.next')}
      </button>
    </div>
  );
}

// ===== DATA TABLE =====
export function DataTable({ columns, data, loading: isLoading, emptyTitle, emptyMessage, onRowClick, className = '' }) {
  if (isLoading) {
    return (
      <div className={`table-container ${className}`}>
        <table className="table">
          <thead>
            <tr>{columns.map((col, i) => <th key={i}>{col.header}</th>)}</tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map((_, j) => (
                  <td key={j}><div className="skeleton-text" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead>
          <tr>{columns.map((col, i) => <th key={i}>{col.header}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row._id || i}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {columns.map((col, j) => (
                <td key={j}>{col.render ? col.render(row) : row[col.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===== FILE UPLOAD =====
export function FileUpload({ accept, maxSize, onUpload, label, multiple = false, className = '' }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleFiles = (files) => {
    setError('');
    const fileList = Array.from(files);
    for (const file of fileList) {
      if (maxSize && file.size > maxSize) {
        setError(`File "${file.name}" exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
        return;
      }
      if (accept) {
        const exts = accept.split(',').map(e => e.trim().toLowerCase());
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        if (!exts.some(e => e === fileExt || file.type.match(e.replace('*', '.*')))) {
          setError(`File "${file.name}" has an unsupported format.`);
          return;
        }
      }
    }
    onUpload(multiple ? fileList : fileList[0]);
  };

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-[var(--color-secondary)] bg-[var(--color-info-bg)]' : ''
        }`}
        style={{ borderColor: dragOver ? undefined : 'var(--color-border)' }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => document.getElementById('file-upload-input')?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('file-upload-input')?.click(); }}
      >
        <svg className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label || 'Click or drag files to upload'}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {accept && `Supported: ${accept}`}
          {maxSize && ` • Max: ${(maxSize / 1024 / 1024).toFixed(0)}MB`}
        </p>
        <input
          id="file-upload-input"
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="error-message mt-2">{error}</p>}
    </div>
  );
}

// ===== SLIDER TRACK =====
export { default as SliderTrack } from './SliderTrack';

