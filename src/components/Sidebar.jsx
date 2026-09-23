// Sidebar — desktop fixed + mobile drawer
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Droplet, History, Bell, PhoneCall, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../auth';
import { unreadCount } from '../store';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/donate', label: 'Donate', icon: Droplet },
  { to: '/history', label: 'Donation History', icon: History },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: true },
  { to: '/emergency', label: 'Emergency', icon: PhoneCall },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const count = unreadCount();

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Logo size={40} />
          <div>
            <div className="brand-name">DonorKonnect</div>
            <div className="brand-sub">Connecting Donors. Saving Lives.</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.badge && count > 0 && <span className="nav-badge">{count}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" style={{ width: '100%' }} onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
