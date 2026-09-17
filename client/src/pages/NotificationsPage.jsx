import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge, Tabs, EmptyState } from '../components/common/index';
import { Bell, Check, Trash2, Megaphone, Calendar, FileText, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const initialAnnouncements = [
  {
    id: 'n-1',
    title: 'MoSPI Circular: Mandatory iGOT Karmayogi Q3 Training Compliance',
    message: 'All officers of ISS and SSS cadres are hereby instructed to complete the accredited module on "Data Governance and Ethics in Official Statistics" before September 30, 2026.',
    date: '2026-09-15 10:30 IST',
    type: 'circular',
    read: false,
    priority: 'high'
  },
  {
    id: 'n-2',
    title: 'Scheduled System Maintenance Notice',
    message: 'The Ministry Learning Management Portal database will undergo security optimization on Saturday, Sep 19 from 22:00 to 02:00 IST. Services will remain unavailable during this window.',
    date: '2026-09-14 16:00 IST',
    type: 'system',
    read: false,
    priority: 'medium'
  },
  {
    id: 'n-3',
    title: 'Assessment Window Open: National Accounts System (GVA)',
    message: 'Your enrollment for the National Accounts evaluation has been approved. You have 7 days to complete the 30-minute timed quiz.',
    date: '2026-09-12 09:15 IST',
    type: 'assessment',
    read: true,
    priority: 'high'
  },
  {
    id: 'n-4',
    title: 'Monthly Review Meeting with DDG (FOD)',
    message: 'Regional Office review meeting is scheduled for Sep 18, 2026 at 11:30 AM via NIC Video Conferencing.',
    date: '2026-09-10 14:00 IST',
    type: 'meeting',
    read: true,
    priority: 'low'
  }
];

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(initialAnnouncements);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Notifications', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'circular', label: 'Official Circulars' },
    { id: 'assessment', label: 'Assessments' }
  ];

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'unread') return !item.read;
    if (activeTab === 'circular') return item.type === 'circular';
    if (activeTab === 'assessment') return item.type === 'assessment';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'circular': return Megaphone;
      case 'assessment': return FileText;
      case 'meeting': return Calendar;
      default: return Bell;
    }
  };

  return (
    <div className="page-container max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span>Portal</span> &bull; <span>Communications</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1" style={{ color: 'var(--color-text-primary)' }}>
            Official Circulars & Notifications
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Ministry announcements, assessment deadlines, and cadre circulars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Check} onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
          <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setNotifications([])}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications to display"
          message="You are all caught up! Official updates and assessment alerts will appear here."
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => {
            const Icon = getIcon(n.type);
            return (
              <Card
                key={n.id}
                className={`p-4 transition-all ${
                  !n.read
                    ? 'border-l-4 border-l-blue-600 bg-blue-50/40 dark:bg-blue-900/10'
                    : 'opacity-80'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-full flex-shrink-0 ${
                    n.type === 'circular' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                    n.type === 'assessment' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm md:text-base font-semibold ${!n.read ? 'text-blue-950 dark:text-blue-100 font-bold' : ''}`} style={{ color: n.read ? 'var(--color-text-primary)' : undefined }}>
                          {n.title}
                        </h3>
                        {!n.read && <Badge variant="info">New</Badge>}
                        {n.priority === 'high' && <Badge variant="error">High Priority</Badge>}
                      </div>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{n.date}</span>
                    </div>

                    <p className="text-xs md:text-sm mt-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                      {n.message}
                    </p>

                    <div className="flex items-center gap-3 mt-3 pt-2 border-t text-xs" style={{ borderColor: 'var(--color-border)' }}>
                      <button
                        onClick={() => handleToggleRead(n.id)}
                        className="font-medium hover:underline text-blue-600 dark:text-blue-400"
                      >
                        {n.read ? 'Mark as Unread' : 'Mark as Read'}
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="font-medium hover:underline text-rose-600"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
