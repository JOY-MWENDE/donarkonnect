// DashboardCard — stat tile with icon, label, value, sub-text
export default function DashboardCard({ icon: Icon, iconBg, iconColor, label, value, sub }) {
  return (
    <div className="dash-card">
      <div className="dc-icon" style={{ background: iconBg, color: iconColor }}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="dc-label">{label}</div>
      <div className="dc-value">{value}</div>
      {sub && <div className="dc-sub">{sub}</div>}
    </div>
  );
}
