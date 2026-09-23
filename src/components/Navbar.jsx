// Navbar — top bar with menu toggle, notification bell, user avatar
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../auth';
import { unreadCount } from '../store';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const count = unreadCount();
  const initials = (user?.fullName || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="navbar">
      <button className="icon-btn menu-toggle" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>
      <div className="navbar-spacer" />
      <button className="icon-btn" onClick={() => navigate('/notifications')} aria-label={`Notifications, ${count} unread`}>
        <Bell size={22} />
        {count > 0 && <span className="dot" />}
      </button>
      <div className="navbar-user" onClick={() => navigate('/profile')} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/profile')}>
        <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
          {initials}
        </div>
        <div className="user-meta">
          <span className="user-name">{user?.fullName}</span>
          <span className="user-role">{user?.bloodGroup} Donor</span>
        </div>
      </div>
      <button className="icon-btn" onClick={logout} aria-label="Logout" title="Logout">
        <LogOut size={20} />
      </button>
    </header>
  );
}
