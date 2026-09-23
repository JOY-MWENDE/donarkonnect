// Notifications — list with read/unread, mark all, view details modal
import { useState, useEffect } from 'react';
import { BellOff, CheckCheck } from 'lucide-react';
import NotificationCard from '../components/NotificationCard';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { getNotifications, markNotificationRead, markAllNotificationsRead, unreadCount } from '../store';
import { useToast } from '../toast';

export default function Notifications() {
  const { toast } = useToast();
  const [notifs, setNotifs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [count, setCount] = useState(0);

  const refresh = () => {
    setNotifs(getNotifications());
    setCount(unreadCount());
  };

  useEffect(() => { refresh(); }, []);

  const handleMarkRead = (id) => {
    markNotificationRead(id);
    refresh();
    toast('Notification marked as read.', 'success');
  };

  const handleMarkAll = () => {
    markAllNotificationsRead();
    refresh();
    toast('All notifications marked as read.', 'success');
  };

  const handleView = (n) => {
    if (!n.read) {
      markNotificationRead(n.id);
      refresh();
    }
    setSelected(n);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>Notifications</h1>
            <p>{count > 0 ? `You have ${count} unread notification${count > 1 ? 's' : ''}.` : 'You are all caught up.'}</p>
          </div>
          {count > 0 && (
            <button className="btn btn-outline" onClick={handleMarkAll}>
              <CheckCheck size={18} /> Mark all as read
            </button>
          )}
        </div>
      </div>

      {notifs.length === 0 ? (
        <div className="empty-state">
          <BellOff size={48} className="es-icon" color="var(--neutral-300)" />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div>
          {notifs.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} onView={handleView} />
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || 'Notification'}
        footer={<button className="btn btn-primary" onClick={() => setSelected(null)}>Close</button>}>
        {selected && (
          <div>
            <div className="mb-4"><StatusBadge status={selected.type === 'emergency' ? 'Critical' : selected.type === 'reminder' ? 'Urgent' : 'Normal'} label={selected.type} /></div>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--neutral-700)' }}>{selected.message}</p>
            <div className="text-muted text-sm mt-4">Received on {selected.date} at {selected.time}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
