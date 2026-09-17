import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge, Modal, EmptyState, SearchBar, Tabs } from '../components/common/index';
import { CheckSquare, Plus, Calendar, Clock, AlertCircle, CheckCircle, Tag, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const initialTasks = [
  {
    _id: 't-1',
    title: 'Complete MoSPI CPI & Index Number Calculation Module',
    description: 'Review standard indices compilation methodologies and finish 10-question practice test.',
    dueDate: '2026-09-20',
    priority: 'high',
    status: 'pending',
    category: 'Learning',
    assignedBy: 'Director, NAD'
  },
  {
    _id: 't-2',
    title: 'Submit Weekly Activity Log (Week 38)',
    description: 'Provide brief account of sampling stratification work conducted for NSS 80th Round.',
    dueDate: '2026-09-22',
    priority: 'medium',
    status: 'in_progress',
    category: 'Report',
    assignedBy: 'Joint Director, FOD'
  },
  {
    _id: 't-3',
    title: 'Review iGOT Karmayogi Course: Official Statistics Ethics',
    description: 'Mandatory 4-hour module for all ISS and SSS officers before Q3 evaluation.',
    dueDate: '2026-09-28',
    priority: 'low',
    status: 'pending',
    category: 'Compliance',
    assignedBy: 'HR Administration'
  },
  {
    _id: 't-4',
    title: 'Attend Data Analytics in R Review Workshop',
    description: 'Join virtual sync with CPD Division on exploratory data techniques.',
    dueDate: '2026-09-15',
    priority: 'high',
    status: 'completed',
    category: 'Meeting',
    assignedBy: 'Deputy Director General'
  }
];

export default function TasksPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tasks, setTasks] = useState(initialTasks);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'Learning'
  });

  const handleToggleComplete = (id) => {
    setTasks(prev => prev.map(task => {
      if (task._id === id) {
        const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const taskObj = {
      _id: `t-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      priority: newTask.priority,
      status: 'pending',
      category: newTask.category,
      assignedBy: user?.name || 'Self Assigned'
    };
    setTasks([taskObj, ...tasks]);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', category: 'Learning' });
    setIsCreateModalOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'pending' && task.status === 'completed') return false;
    if (filterStatus === 'completed' && task.status !== 'completed') return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q) || task.category.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status !== 'completed').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
  };

  const priorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <div className="page-container max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span>Portal</span> &bull; <span>Action Items</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1" style={{ color: 'var(--color-text-primary)' }}>
            Tasks & Action Items
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Manage official learning milestones, reporting deadlines, and training obligations.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
          Create New Task
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Total Assigned</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Pending</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Completed</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.completed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>High Priority</p>
          <p className="text-2xl font-bold mt-1 text-rose-600">{stats.highPriority}</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tasks by title, category, or note..." />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
              <span className="font-medium text-xs uppercase" style={{ color: 'var(--color-text-muted)' }}>Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input py-1 px-2.5 text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-xs uppercase" style={{ color: 'var(--color-text-muted)' }}>Priority:</span>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="input py-1 px-2.5 text-sm rounded-md"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks match your criteria"
          message="Try adjusting your filters or create a new task to stay organized."
          action={() => { setFilterStatus('all'); setFilterPriority('all'); setSearchQuery(''); }}
          actionLabel="Clear Filters"
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <Card
              key={task._id}
              className={`p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                task.status === 'completed' ? 'opacity-70 bg-opacity-40' : ''
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(task._id)}
                  className="mt-0.5 text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none"
                  aria-label={task.status === 'completed' ? 'Mark task pending' : 'Mark task completed'}
                >
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <div className="w-5 h-5 rounded border-2 border-gray-400 hover:border-emerald-600 flex items-center justify-center" />
                  )}
                </button>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-base font-semibold ${
                        task.status === 'completed' ? 'line-through text-gray-400' : ''
                      }`}
                      style={{ color: task.status === 'completed' ? undefined : 'var(--color-text-primary)' }}
                    >
                      {task.title}
                    </h3>
                    <Badge variant={priorityBadgeVariant(task.priority)}>
                      {task.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="info">
                      {task.category}
                    </Badge>
                  </div>
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                    {task.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs pt-1" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Due: {task.dueDate}
                    </span>
                    <span>Assigned: {task.assignedBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Button
                  variant={task.status === 'completed' ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleComplete(task._id)}
                >
                  {task.status === 'completed' ? 'Reopen' : 'Complete'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Action Item"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Submit Survey Sampling Plan"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
              Detailed Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide relevant details or references..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="input w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Due Date
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="input w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
              Category
            </label>
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              className="input w-full"
            >
              <option value="Learning">Learning & Training</option>
              <option value="Assessment">Assessment & Testing</option>
              <option value="Report">Weekly / Monthly Report</option>
              <option value="Compliance">Government Compliance</option>
              <option value="Meeting">Meeting / Sync</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
