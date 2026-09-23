// BottomNav — mobile bottom navigation bar
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Droplet, Bell, PhoneCall } from 'lucide-react';
import { unreadCount } from '../store';

const items = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/donate', label: 'Donate', icon: Droplet },
  { to: '/notifications', label: 'Alerts', icon: Bell, badge: true },
  { to: '/emergency', label: 'Emergency', icon: PhoneCall },
];

export default function BottomNav() {
  const count = unreadCount();
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
          <item.icon size={22} />
          <span>{item.label}</span>
          {item.badge && count > 0 && <span className="bn-badge">{count}</span>}
        </NavLink>
      ))}
    </nav>
  );
}
