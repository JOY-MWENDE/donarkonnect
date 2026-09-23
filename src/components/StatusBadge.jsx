// StatusBadge — reusable pill badge with color-coded dot
export default function StatusBadge({ status, label }) {
  const map = {
    available: 'available',
    unavailable: 'unavailable',
    Completed: 'completed',
    Pending: 'pending',
    Critical: 'critical',
    Urgent: 'urgent',
    Normal: 'normal',
  };
  const cls = map[status] || 'normal';
  return (
    <span className={`status-badge ${cls}`}>
      <span className="sb-dot" />
      {label || status}
    </span>
  );
}
