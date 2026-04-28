import { useState } from 'react';
import { createTask } from '../services/api';

export default function AddTaskForm({ onAdd }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setLoading(true);
    try {
      const { data } = await createTask(form);
      onAdd(data.task);
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      setExpanded(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 border-dashed border-slate-600/60 hover:border-brand-500/40 transition-colors duration-200">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 text-slate-400 hover:text-white w-full transition-colors text-sm"
        >
          <div className="w-6 h-6 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span>Add a new task…</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 animate-slide-up">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task title *"
            autoFocus
            className="input-field text-sm py-2.5"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            rows={2}
            className="input-field text-sm py-2.5 resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <select name="priority" value={form.priority} onChange={handleChange} className="input-field text-sm py-2">
              <option value="low">🟢 Low priority</option>
              <option value="medium">🟡 Medium priority</option>
              <option value="high">🔴 High priority</option>
            </select>
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className="input-field text-sm py-2"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-4">
              {loading ? 'Adding…' : 'Add Task'}
            </button>
            <button
              type="button"
              onClick={() => { setExpanded(false); setError(''); }}
              className="btn-secondary text-sm py-2 px-4"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
