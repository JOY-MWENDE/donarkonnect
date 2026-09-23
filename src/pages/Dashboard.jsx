// Dashboard — donor overview with stat cards, blood group hero, quick actions
import { useNavigate } from 'react-router-dom';
import { Droplet, Heart, Calendar, CalendarClock, Activity, PhoneCall, History, ToggleRight } from 'lucide-react';
import { useAuth } from '../auth';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import { getDonations, formatDate, eligibleDate } from '../store';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const donations = getDonations();
  const total = donations.length;
  const lastDate = user.lastDonation || (donations[0]?.date ?? null);
  const nextEligible = eligibleDate(lastDate);

  const quickActions = [
    { title: 'Donate Blood', sub: 'Record a new donation', icon: Droplet, bg: 'var(--primary-50)', color: 'var(--primary-500)', to: '/donate' },
    { title: 'Update Availability', sub: user.available ? 'Currently available' : 'Currently unavailable', icon: ToggleRight, bg: 'var(--success-50)', color: 'var(--success-500)', to: '/donate' },
    { title: 'View History', sub: `${total} donations recorded`, icon: History, bg: 'var(--warning-50)', color: 'var(--warning-500)', to: '/history' },
    { title: 'Emergency Request', sub: 'Request or respond', icon: PhoneCall, bg: 'var(--error-50)', color: 'var(--error-500)', to: '/emergency' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user.fullName.split(' ')[0]}!</h1>
        <p>Here's an overview of your donation activity.</p>
      </div>

      {/* Blood group hero */}
      <div className="blood-hero mb-8">
        <div className="bh-info">
          <span className="bh-label">Your Blood Group</span>
          <span className="bh-group">{user.bloodGroup}</span>
        </div>
        <div className="bh-info" style={{ alignItems: 'flex-end' }}>
          <span className="bh-label">Donation Status</span>
          <div style={{ marginTop: 4 }}>
            <StatusBadge status={user.available ? 'available' : 'unavailable'} label={user.available ? 'Available' : 'Unavailable'} />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="cards-grid section-gap">
        <DashboardCard icon={Droplet} iconBg="var(--primary-50)" iconColor="var(--primary-500)" label="Blood Group" value={user.bloodGroup} sub="Your registered type" />
        <DashboardCard icon={Activity} iconBg={user.available ? 'var(--success-50)' : 'var(--neutral-100)'} iconColor={user.available ? 'var(--success-500)' : 'var(--neutral-500)'} label="Availability" value={user.available ? 'Available' : 'Unavailable'} sub="To donate blood" />
        <DashboardCard icon={Heart} iconBg="var(--error-50)" iconColor="var(--error-500)" label="Total Donations" value={total} sub="Lifetime donations" />
        <DashboardCard icon={Calendar} iconBg="var(--warning-50)" iconColor="var(--warning-500)" label="Last Donation" value={formatDate(lastDate)} sub={lastDate ? 'Thank you!' : 'No donations yet'} />
        <DashboardCard icon={CalendarClock} iconBg="var(--primary-50)" iconColor="var(--primary-500)" label="Next Eligible" value={formatDate(nextEligible)} sub="3 months after last donation" />
      </div>

      {/* Quick actions */}
      <div className="section-gap">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          {quickActions.map((qa) => (
            <button key={qa.title} className="quick-action" onClick={() => navigate(qa.to)}>
              <div className="qa-icon" style={{ background: qa.bg, color: qa.color }}><qa.icon size={22} /></div>
              <div>
                <div className="qa-title">{qa.title}</div>
                <div className="qa-sub">{qa.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Emergency banner */}
      <div className="card card-pad" style={{ background: 'linear-gradient(135deg, var(--error-50), var(--primary-50))', borderColor: 'var(--error-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="dc-icon" style={{ background: 'var(--error-500)', color: '#fff', margin: 0 }}><PhoneCall size={24} /></div>
          <div>
            <h3 style={{ marginBottom: 4 }}>Emergency Blood Request</h3>
            <p className="text-muted text-sm">Need blood urgently or want to respond to an emergency request?</p>
          </div>
        </div>
        <button className="btn btn-danger" onClick={() => navigate('/emergency')}>View Emergency Requests</button>
      </div>
    </div>
  );
}
