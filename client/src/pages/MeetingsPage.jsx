import { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, EmptyState, Tabs } from '../components/common/index';
import api from '../services/api';
import { CalendarCheck, Plus, ExternalLink, Download, Clock, MapPin, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function MeetingsPage() {
  const { isHR, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', date: '', startTime: '', endTime: '', platform: 'Google Meet', meetingLink: '', department: '' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'attendance', label: 'Attendance' },
  ];

  const [meetings, setMeetings] = useState([]);

  const fetchMeetings = async () => {
    try {
      const res = await api.get('/meetings');
      setMeetings(res.data.data || []);
      // Also update localStorage so HR/Employee dashboards have the data until they are updated to use API
      localStorage.setItem('mospi-meetings', JSON.stringify(res.data.data || []));
    } catch (err) {
      console.error('Failed to fetch meetings', err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newMeeting = {
      title: createForm.title,
      date: createForm.date,
      time: `${createForm.startTime} - ${createForm.endTime}`,
      link: createForm.meetingLink,
      platform: createForm.platform,
      department: createForm.department,
      status: 'Upcoming'
    };
    
    try {
      await api.post('/meetings', newMeeting);
      await fetchMeetings();
      setCreateSuccess('Meeting created successfully!');
    } catch (err) {
      console.error(err);
    }
    
    setCreateLoading(false);
    setTimeout(() => { 
      setShowCreate(false); 
      setCreateSuccess(''); 
      setCreateForm({ title: '', description: '', date: '', startTime: '', endTime: '', platform: 'Google Meet', meetingLink: '', department: '' });
    }, 1500);
  };

  const handleJoin = (link) => { if (link) window.open(link, '_blank'); };

  const downloadICS = (meeting) => {
    // Attempt to parse '2026-09-24' and '14:30 - 15:30'
    let startStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    let endStr = new Date(Date.now() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    try {
      if (meeting.date) {
        const d = new Date(meeting.date);
        const ymd = d.toISOString().split('T')[0].replace(/-/g, '');
        let startTime = '090000';
        let endTime = '100000';
        if (meeting.time) {
          const match = meeting.time.match(/(\d{2}):(\d{2})/g);
          if (match && match.length >= 1) startTime = match[0].replace(':', '') + '00';
          if (match && match.length >= 2) endTime = match[1].replace(':', '') + '00';
        }
        startStr = `${ymd}T${startTime}Z`;
        endStr = `${ymd}T${endTime}Z`;
      }
    } catch (e) {}

    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${meeting.title || 'Meeting'}\nDTSTART:${startStr}\nDTEND:${endStr}\nLOCATION:${meeting.platform || ''}\nDESCRIPTION:${meeting.link || ''}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = `${(meeting.title || 'meeting').replace(/\s+/g, '_')}.ics`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-custom py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>Meetings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>View and manage meetings</p>
        </div>
        {(isHR || isAdmin) && <Button icon={Plus} onClick={() => setShowCreate(true)}>Create Meeting</Button>}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      <Card className="p-5">
        {meetings.length === 0 ? (
          <EmptyState icon={CalendarCheck} title="No Meetings" message="Meetings will appear here once created by HR or Admin." action={(isHR || isAdmin) ? () => setShowCreate(true) : undefined} actionLabel="Create Meeting" />
        ) : (
          <div className="space-y-4">
            {meetings.map(m => (
              <div key={m._id || m.id} className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800" style={{ borderColor: 'var(--color-border)' }}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>{m.title}</h3>
                    <Badge variant={m.status === 'Upcoming' ? 'success' : 'neutral'}>{m.status}</Badge>
                  </div>
                  <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {m.date} at {m.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {m.platform}</span>
                    {m.department && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {m.department}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" icon={Download} onClick={() => downloadICS(m)}>ICS</Button>
                  {m.link && <Button variant="primary" size="sm" icon={ExternalLink} onClick={() => handleJoin(m.link)}>Join</Button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Meeting" size="lg"
        footer={<><Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button><Button onClick={handleCreate} loading={createLoading}>Create Meeting</Button></>}>
        {createSuccess && <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>{createSuccess}</div>}
        <form className="grid md:grid-cols-2 gap-4">
          <div className="form-group mb-0"><label className="label">Meeting Title *</label><input className="input" value={createForm.title} onChange={(e) => setCreateForm({...createForm, title: e.target.value})} /></div>
          <div className="form-group mb-0"><label className="label">Platform</label>
            <select className="select" value={createForm.platform} onChange={(e) => setCreateForm({...createForm, platform: e.target.value})}>
              <option>Google Meet</option><option>Microsoft Teams</option><option>Zoom</option><option>Other</option>
            </select>
          </div>
          <div className="form-group mb-0"><label className="label">Date *</label><input className="input" type="date" value={createForm.date} onChange={(e) => setCreateForm({...createForm, date: e.target.value})} /></div>
          <div className="form-group mb-0"><label className="label">Department</label><input className="input" value={createForm.department} onChange={(e) => setCreateForm({...createForm, department: e.target.value})} /></div>
          <div className="form-group mb-0"><label className="label">Start Time *</label><input className="input" type="time" value={createForm.startTime} onChange={(e) => setCreateForm({...createForm, startTime: e.target.value})} /></div>
          <div className="form-group mb-0"><label className="label">End Time *</label><input className="input" type="time" value={createForm.endTime} onChange={(e) => setCreateForm({...createForm, endTime: e.target.value})} /></div>
          <div className="md:col-span-2 form-group mb-0"><label className="label">Meeting Link</label><input className="input" value={createForm.meetingLink} onChange={(e) => setCreateForm({...createForm, meetingLink: e.target.value})} placeholder="https://meet.google.com/..." /></div>
          <div className="md:col-span-2 form-group mb-0"><label className="label">Description</label><textarea className="textarea" rows={2} value={createForm.description} onChange={(e) => setCreateForm({...createForm, description: e.target.value})} /></div>
        </form>
      </Modal>
    </div>
  );
}
