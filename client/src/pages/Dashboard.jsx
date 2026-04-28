import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, getStats } from '../services/api';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import AddTaskForm from '../components/AddTaskForm';
import StatsBar from '../components/StatsBar';

const FILTERS = [
  { label: 'All',         value: 'all' },
  { label: 'Pending',     value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',   value: 'completed' },
];

const PRIORITY_FILTERS = [
  { label: 'All Priority', value: 'all' },
  { label: 'High',         value: 'high' },
  { label: 'Medium',       value: 'medium' },
  { label: 'Low',          value: 'low' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (search) params.search = search;

      const [tasksRes, statsRes] = await Promise.all([
        getTasks(params),
        getStats(),
      ]);
      setTasks(tasksRes.data.tasks);
      setStats(statsRes.data.stats);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, search]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleAdd = (task) => {
    setTasks(prev => [task, ...prev]);
    setStats(prev => prev ? { ...prev, total: prev.total + 1, pending: prev.pending + 1 } : prev);
  };

  const handleUpdate = (updated) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    // Refresh stats after update
    getStats().then(r => setStats(r.data.stats)).catch(() => {});
  };

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    getStats().then(r => setStats(r.data.stats)).catch(() => {});
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-7">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Here's what's on your plate today.</p>
        </div>

        {/* Stats */}
        <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <StatsBar stats={stats} />
        </div>

        {/* Add Task */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <AddTaskForm onAdd={handleAdd} />
        </div>

        {/* Filters & Search */}
        <div className="animate-slide-up space-y-3" style={{ animationDelay: '0.15s' }}>
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search tasks…"
              className="input-field pl-10 text-sm py-2.5"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setSearch(''); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            <div className="flex bg-surface-800/60 border border-slate-700/50 rounded-xl p-1 gap-0.5">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    statusFilter === f.value
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex bg-surface-800/60 border border-slate-700/50 rounded-xl p-1 gap-0.5">
              {PRIORITY_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setPriorityFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    priorityFilter === f.value
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="animate-slide-up space-y-2.5" style={{ animationDelay: '0.2s' }}>
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
              <button onClick={fetchTasks} className="ml-auto text-xs underline hover:no-underline">Retry</button>
            </div>
          )}

          {loading ? (
            <div className="space-y-2.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-5 animate-pulse" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-slate-700 rounded-full mt-0.5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-700 rounded w-2/3" />
                      <div className="h-3 bg-slate-800 rounded w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-5 w-16 bg-slate-700 rounded-lg" />
                        <div className="h-5 w-14 bg-slate-700 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-300 font-medium mb-1">
                {search || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'No tasks match your filters'
                  : 'No tasks yet'}
              </p>
              <p className="text-slate-600 text-sm">
                {search || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting or clearing your filters.'
                  : 'Add your first task using the form above.'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 font-medium">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                  {(statusFilter !== 'all' || priorityFilter !== 'all' || search) && ' (filtered)'}
                </span>
              </div>
              {tasks.map((task, i) => (
                <div key={task.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <TaskItem task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
