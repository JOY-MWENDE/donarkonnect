// ProfileCard — sidebar/profile summary card with avatar + key info
import StatusBadge from './StatusBadge';

export default function ProfileCard({ user, showStatus = true }) {
  const initials = (user.fullName || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="card card-pad profile-card-wrap">
      <div className="profile-avatar-lg">{initials}</div>
      <h3 style={{ marginBottom: 4 }}>{user.fullName}</h3>
      <div className="text-muted text-sm" style={{ marginBottom: 12 }}>{user.email}</div>
      <div className="dc-bgroup" style={{ display: 'inline-block', background: 'var(--primary-50)', color: 'var(--primary-600)', padding: '6px 18px', borderRadius: 12, fontWeight: 800, fontSize: '1.2rem', marginBottom: 16 }}>
        {user.bloodGroup}
      </div>
      {showStatus && (
        <div style={{ marginTop: 8 }}>
          <StatusBadge status={user.available ? 'available' : 'unavailable'} label={user.available ? 'Available' : 'Unavailable'} />
        </div>
      )}
    </div>
  );
}
