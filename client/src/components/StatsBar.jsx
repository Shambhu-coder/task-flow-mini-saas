const StatCard = ({ label, value, color, icon }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</span>
      <span className={`text-xs ${color}`}>{icon}</span>
    </div>
    <span className={`text-3xl font-bold font-display ${color}`}>{value}</span>
  </div>
);

export default function StatsBar({ stats }) {
  if (!stats) return null;
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total"       value={stats.total}      color="text-slate-300"  icon="📋" />
        <StatCard label="Pending"     value={stats.pending}    color="text-yellow-400" icon="⏳" />
        <StatCard label="In Progress" value={stats.inProgress} color="text-brand-400"  icon="⚡" />
        <StatCard label="Completed"   value={stats.completed}  color="text-green-400"  icon="✅" />
      </div>

      {stats.total > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Overall Progress</span>
            <span className="text-xs font-mono font-medium text-brand-400">{pct}%</span>
          </div>
          <div className="h-2 bg-surface-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
