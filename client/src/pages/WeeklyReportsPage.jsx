import { useState } from 'react';
import { Card, Button, Badge, FileUpload, EmptyState, Tabs, ProgressBar } from '../components/common/index';
import { FileText, Upload, Download, TrendingUp, ArrowRight } from 'lucide-react';

export default function WeeklyReportsPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const tabs = [
    { id: 'upload', label: 'Upload Report' },
    { id: 'history', label: 'Report History' },
    { id: 'summary', label: 'Weekly Summary' },
  ];

  const handleUpload = (file) => { setUploadedFile(file); };
  const handleSubmit = () => { setSubmitted(true); };

  const handleExport = (format) => {
    const data = `Weekly Report - Week ${selectedWeek}\nEmployee: Current User\nDate: ${new Date().toLocaleDateString()}\nStatus: Submitted`;
    if (format === 'csv') {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; 
      a.download = `weekly_report_week${selectedWeek}.csv`; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container-custom py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h2 font-bold" style={{ color: 'var(--color-text-primary)' }}>Weekly Reports</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Upload reports and track your weekly progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={Download} onClick={() => handleExport('csv')}>Export CSV</Button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <label className="label mb-0">Week:</label>
        <select className="select w-auto" value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(w => <option key={w} value={w}>Week {w}</option>)}
        </select>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {activeTab === 'upload' && (
        <Card className="p-6">
          {!submitted ? (
            <>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Upload Week {selectedWeek} Report</h3>
              <FileUpload accept=".pdf,.docx,.xlsx,.csv,.txt" maxSize={10 * 1024 * 1024} onUpload={handleUpload} label="Upload your weekly report (PDF, DOCX, XLSX, CSV, or TXT)" />
              {uploadedFile && (
                <div className="mt-4 p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'var(--color-success-bg)' }}>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-success)' }}>{uploadedFile.name}</span>
                  </div>
                  <Button size="sm" onClick={handleSubmit}>Submit Report</Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="p-3 rounded-full inline-flex mb-3" style={{ backgroundColor: 'var(--color-success-bg)' }}>
                <TrendingUp className="w-8 h-8" style={{ color: 'var(--color-success)' }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Report Submitted!</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Week {selectedWeek} report has been uploaded successfully.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSubmitted(false); setUploadedFile(null); }}>Upload Another</Button>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'history' && (
        <Card className="p-5">
          <EmptyState icon={FileText} title="No Reports Yet" message="Upload your first weekly report to get started." />
        </Card>
      )}

      {activeTab === 'summary' && (
        <Card className="p-5">
          <EmptyState icon={TrendingUp} title="No Summary Available" message="Summaries are generated after submitting weekly reports and assessments." />
        </Card>
      )}
    </div>
  );
}
