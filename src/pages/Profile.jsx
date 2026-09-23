// Profile — view, edit, donor card download/print, donation history CSV
import { useState, useRef } from 'react';
import { Edit3, Download, Printer, FileText, Droplet, User, Phone, Mail, MapPin, Calendar, Heart } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import ProfileCard from '../components/ProfileCard';
import Modal from '../components/Modal';
import { getDonations, formatDate } from '../store';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const printRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  if (!user) return null;
  const donations = getDonations();

  const startEdit = () => {
    setForm({ ...user });
    setEditing(true);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const saveEdit = (ev) => {
    ev.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.location.trim()) {
      toast('Please fill in all required fields.', 'error');
      return;
    }
    updateProfile(form);
    toast('Profile updated successfully.', 'success');
    setEditing(false);
  };

  const downloadCSV = () => {
    if (donations.length === 0) {
      toast('No donation history to download.', 'info');
      return;
    }
    const headers = ['Hospital', 'Date', 'Time', 'Blood Group', 'Units', 'Location', 'Status'];
    const rows = donations.map((d) => [d.hospital, d.date, d.time, d.bloodGroup, d.units, d.location, d.status]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donorkonnect-history-${user.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Donation history downloaded as CSV.', 'success');
  };

  const downloadCard = () => {
    // Generate an HTML file and trigger download
    const cardHTML = printRef.current?.outerHTML || '';
    const html = `<!doctype html><html><head><title>DonorKonnect Card - ${user.fullName}</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap">
      <style>${getCardStyles()}</style></head>
      <body style="display:grid;place-items:center;min-height:100vh;background:#f8fafc;margin:0">${cardHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donorkonnect-card-${user.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Donor card downloaded.', 'success');
  };

  const printCard = () => {
    window.print();
  };

  const initials = user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const profileRows = [
    { icon: User, key: 'Full Name', val: user.fullName },
    { icon: Droplet, key: 'Blood Group', val: user.bloodGroup },
    { icon: Heart, key: 'Gender', val: user.gender },
    { icon: Phone, key: 'Phone Number', val: user.phone },
    { icon: Mail, key: 'Email', val: user.email },
    { icon: MapPin, key: 'Location', val: user.location },
    { icon: Calendar, key: 'Last Blood Donation', val: formatDate(user.lastDonation) },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View and manage your donor information.</p>
      </div>

      <div className="profile-grid">
        {/* Left column: profile card + donor card */}
        <div>
          <ProfileCard user={user} />

          <div className="card card-pad mt-6">
            <h3 className="section-title">Donor Card</h3>
            <div className="print-area" ref={printRef}>
              <DonorCardHTML user={user} initials={initials} />
            </div>
            <div className="flex gap-3 mt-6" style={{ flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={downloadCard}><Download size={18} /> Download Card</button>
              <button className="btn btn-outline" onClick={printCard}><Printer size={18} /> Print Card</button>
            </div>
          </div>
        </div>

        {/* Right column: profile info + actions */}
        <div>
          <div className="card card-pad mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title" style={{ marginBottom: 0 }}>Profile Information</h3>
              <button className="btn btn-outline btn-sm" onClick={startEdit}><Edit3 size={16} /> Edit Profile</button>
            </div>
            <div className="profile-info-list">
              {profileRows.map((r) => (
                <div key={r.key} className="profile-info-row">
                  <span className="pi-key"><r.icon size={16} /> {r.key}</span>
                  <span className="pi-val">{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <h3 className="section-title">Documents</h3>
            <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
              <button className="btn btn-outline" onClick={downloadCSV}><FileText size={18} /> Download Donation History</button>
            </div>
            <p className="form-hint mt-2">Exports your complete donation history as a CSV file.</p>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Profile"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
          </>
        }>
        {form && (
          <form onSubmit={saveEdit} noValidate>
            <div className="form-group">
              <label htmlFor="efull">Full Name <span className="req">*</span></label>
              <input id="efull" className="input" value={form.fullName} onChange={set('fullName')} />
            </div>
            <div className="form-group">
              <label htmlFor="eemail">Email <span className="req">*</span></label>
              <input id="eemail" type="email" className="input" value={form.email} onChange={set('email')} />
            </div>
            <div className="form-group">
              <label htmlFor="ephone">Phone Number <span className="req">*</span></label>
              <input id="ephone" className="input" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="form-group">
              <label htmlFor="eloc">Location <span className="req">*</span></label>
              <input id="eloc" className="input" value={form.location} onChange={set('location')} />
            </div>
            <div className="form-group">
              <label htmlFor="ebg">Blood Group</label>
              <select id="ebg" className="select" value={form.bloodGroup} onChange={set('bloodGroup')}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="egen">Gender</label>
              <select id="egen" className="select" value={form.gender} onChange={set('gender')}>
                {['Male', 'Female', 'Other'].map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// Donor card visual component (also used for print)
function DonorCardHTML({ user, initials }) {
  return (
    <div className="donor-card">
      <div className="dc-head">
        <div className="dc-brand"><Droplet size={22} fill="#fff" color="#fff" /> DonorKonnect</div>
        <div className="dc-bgroup">{user.bloodGroup}</div>
      </div>
      <div className="dc-avatar">{initials}</div>
      <div className="dc-name">{user.fullName}</div>
      <div className="dc-id">Donor ID: {user.id}</div>
      <div className="dc-grid">
        <div className="dc-field"><div className="dc-fkey">Blood Group</div><div className="dc-fval">{user.bloodGroup}</div></div>
        <div className="dc-field"><div className="dc-fkey">Gender</div><div className="dc-fval">{user.gender}</div></div>
        <div className="dc-field"><div className="dc-fkey">Phone</div><div className="dc-fval">{user.phone}</div></div>
        <div className="dc-field"><div className="dc-fkey">Location</div><div className="dc-fval">{user.location}</div></div>
      </div>
      <div className="dc-quote">"Your donation can save a life."</div>
    </div>
  );
}

// Inline styles for downloaded card HTML
function getCardStyles() {
  return `
    :root{--primary-500:#e11d2a;--primary-700:#a01019;--primary-800:#841218}
    body{font-family:Inter,sans-serif}
    .donor-card{width:420px;max-width:100%;border-radius:16px;background:linear-gradient(135deg,#c41420,#6b0e14);color:#fff;padding:32px;position:relative;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.12)}
    .donor-card::before{content:'';position:absolute;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.08);top:-80px;right:-60px}
    .dc-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;position:relative}
    .dc-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.2rem}
    .dc-avatar{width:72px;height:72px;border-radius:50%;border:3px solid rgba(255,255,255,0.3);margin:0 auto 16px;display:grid;place-items:center;background:rgba(255,255,255,0.15);font-size:1.8rem;font-weight:800;position:relative}
    .dc-name{text-align:center;font-size:1.3rem;font-weight:800;margin-bottom:4px;position:relative}
    .dc-id{text-align:center;font-size:0.8rem;opacity:0.8;margin-bottom:20px;position:relative}
    .dc-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;position:relative}
    .dc-field .dc-fkey{font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;opacity:0.7}
    .dc-field .dc-fval{font-size:0.95rem;font-weight:700}
    .dc-quote{text-align:center;font-size:0.82rem;opacity:0.85;margin-top:22px;font-style:italic;position:relative}
    .dc-bgroup{font-size:1.8rem;font-weight:900;background:rgba(255,255,255,0.18);padding:6px 16px;border-radius:12px}
  `;
}
