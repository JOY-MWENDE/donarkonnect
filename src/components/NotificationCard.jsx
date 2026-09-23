// NotificationCard — single notification row with type icon, read/unread styling
import { AlertCircle, Bell, CheckCircle2, Clock, Heart } from 'lucide-react';
import StatusBadge from './StatusBadge';

const typeConfig = {
  emergency: { icon: AlertCircle, bg: 'var(--error-50)', color: 'var(--error-500)', label: 'Emergency' },
  reminder: { icon: Clock, bg: 'var(--warning-50)', color: 'var(--warning-500)', label: 'Reminder' },
  success: { icon: CheckCircle2, bg: 'var(--success-50)', color: 'var(--success-500)', label: 'Success' },
  eligibility: { icon: Heart, bg: 'var(--primary-50)', color: 'var(--primary-500)', label: 'Eligibility' },
  general: { icon: Bell, bg: 'var(--neutral-100)', color: 'var(--neutral-600)', label: 'General' },
};

export default function NotificationCard({ notification, onView, onMarkRead }) {
  const cfg = typeConfig[notification.type] || typeConfig.general;
  const Icon = cfg.icon;
  return (
    <div className={`notif-card ${notification.read ? '' : 'unread'}`}>
      <div className="nc-icon" style={{ background: cfg.bg, color: cfg.color }}>
        <Icon size={22} />
      </div>
      <div className="nc-body">
        <div className="nc-title">{notification.title}</div>
        <div className="nc-msg">{notification.message}</div>
        <div className="nc-meta">
          <StatusBadge status={cfg.label === 'Emergency' ? 'Critical' : cfg.label === 'Reminder' ? 'Urgent' : 'Normal'} label={cfg.label} />
          <span className="nc-time">{notification.date} · {notification.time}</span>
        </div>
      </div>
      <div className="nc-actions">
        {!notification.read && (
          <button className="btn btn-ghost btn-sm" onClick={() => onMarkRead(notification.id)}>Mark as Read</button>
        )}
        <button className="btn btn-outline btn-sm" onClick={() => onView(notification)}>View Details</button>
      </div>
    </div>
  );
}
