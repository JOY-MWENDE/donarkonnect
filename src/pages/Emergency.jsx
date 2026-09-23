// Emergency — create emergency requests + respond to existing ones
import { useState, useEffect } from 'react';
import { PhoneCall, Droplet, Building2, MapPin, Package, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { getEmergencies, addEmergency, addNotification } from '../store';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCIES = ['Critical', 'Urgent', 'Normal'];

export default function Emergency() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [emergencies, setEmergencies] = useState([]);
  const [form, setForm] = useState({
    bloodGroup: '', hospital: '', location: '', units: '', urgency: 'Urgent', contact: '', info: '',
  });
  const [errors, setErrors] = useState({});
  const [detail, setDetail] = useState(null);
  const [respond, setRespond] = useState(null);

  const refresh = () => setEmergencies(getEmergencies());
  useEffect(() => { refresh(); }, []);

  if (!user) return null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.bloodGroup) e.bloodGroup = 'Blood group is required.';
    if (!form.hospital.trim()) e.hospital = 'Hospital is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (!form.units || form.units < 1) e.units = 'Units needed is required.';
    if (!form.urgency) e.urgency = 'Urgency level is required.';
    if (!form.contact.trim()) e.contact = 'Contact number is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast('Please fill in all required fields.', 'error');
      return;
    }
    addEmergency({ ...form, units: parseInt(form.units, 10) });
    addNotification({
      title: 'Emergency Blood Request Posted',
      message: `Your ${form.urgency.toLowerCase()} request for ${form.bloodGroup} blood at ${form.hospital} has been posted.`,
      type: 'emergency',
    });
    toast('Emergency blood request posted successfully.', 'success');
    refresh();
    setForm({ bloodGroup: '', hospital: '', location: '', units: '', urgency: 'Urgent', contact: '', info: '' });
  };

  const handleRespond = () => {
    if (!user.available) {
      toast('You must be marked as available to respond. Go to Donate to update your status.', 'error');
      return;
    }
    if (user.bloodGroup !== respond.bloodGroup) {
      toast(`Your blood group (${user.bloodGroup}) does not match the request (${respond.bloodGroup}).`, 'error');
      return;
    }
    addNotification({
      title: 'Emergency Response Confirmed',
      message: `You have responded to the ${respond.urgency.toLowerCase()} request for ${respond.bloodGroup} blood at ${respond.hospital}. Please contact ${respond.contact}.`,
      type: 'success',
    });
    toast(`Thank you! You have responded to the emergency request. Contact: ${respond.contact}`, 'success');
    setRespond(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Emergency Blood Request</h1>
        <p>Post an emergency request or respond to one in your area.</p>
      </div>

      {/* Request form */}
      <div className="card card-pad section-gap">
        <div className="flex items-center gap-3 mb-6">
          <div className="dc-icon" style={{ background: 'var(--error-50)', color: 'var(--error-500)', margin: 0 }}><AlertTriangle size={24} /></div>
          <div>
            <h3 style={{ marginBottom: 0 }}>Post a Blood Request</h3>
            <p className="text-muted text-sm">Fill in the details below to request blood.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="form-group">
              <label htmlFor="bg">Blood Group Needed <span className="req">*</span></label>
              <select id="bg" className={`select ${errors.bloodGroup ? 'error' : ''}`} value={form.bloodGroup} onChange={set('bloodGroup')}>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.bloodGroup && <div className="form-error">{errors.bloodGroup}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="hosp">Hospital <span className="req">*</span></label>
              <input id="hosp" className={`input ${errors.hospital ? 'error' : ''}`} placeholder="Hospital name" value={form.hospital} onChange={set('hospital')} />
              {errors.hospital && <div className="form-error">{errors.hospital}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="loc">Location <span className="req">*</span></label>
              <input id="loc" className={`input ${errors.location ? 'error' : ''}`} placeholder="City" value={form.location} onChange={set('location')} />
              {errors.location && <div className="form-error">{errors.location}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="units">Units Needed <span className="req">*</span></label>
              <input id="units" type="number" min="1" className={`input ${errors.units ? 'error' : ''}`} placeholder="e.g. 3" value={form.units} onChange={set('units')} />
              {errors.units && <div className="form-error">{errors.units}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="urgency">Urgency <span className="req">*</span></label>
              <select id="urgency" className={`select ${errors.urgency ? 'error' : ''}`} value={form.urgency} onChange={set('urgency')}>
                {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              {errors.urgency && <div className="form-error">{errors.urgency}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number <span className="req">*</span></label>
              <input id="contact" className={`input ${errors.contact ? 'error' : ''}`} placeholder="07XXXXXXXX" value={form.contact} onChange={set('contact')} />
              {errors.contact && <div className="form-error">{errors.contact}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="info">Additional Information</label>
            <textarea id="info" className="textarea" placeholder="Any additional details about the request..." value={form.info} onChange={set('info')} />
          </div>

          <button type="submit" className="btn btn-danger btn-lg">
            <PhoneCall size={20} /> Request Blood
          </button>
        </form>
      </div>

      {/* Active emergency requests */}
      <div>
        <h2 className="section-title">Active Emergency Requests</h2>
        {emergencies.length === 0 ? (
          <div className="empty-state">
            <Droplet size={48} className="es-icon" color="var(--neutral-300)" />
            <p>No active emergency requests right now.</p>
          </div>
        ) : (
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {emergencies.map((em) => (
              <div key={em.id} className="emergency-card">
                <div className="ec-top">
                  <div className="ec-blood">{em.bloodGroup}</div>
                  <StatusBadge status={em.urgency} label={em.urgency.toUpperCase()} />
                </div>
                <div className="ec-info">
                  <div className="ec-row"><span className="ec-key"><Building2 size={14} /> Hospital</span><span className="ec-val">{em.hospital}</span></div>
                  <div className="ec-row"><span className="ec-key"><MapPin size={14} /> Location</span><span className="ec-val">{em.location}</span></div>
                  <div className="ec-row"><span className="ec-key"><Package size={14} /> Units</span><span className="ec-val">{em.units}</span></div>
                  <div className="ec-row"><span className="ec-key"><PhoneCall size={14} /> Contact</span><span className="ec-val">{em.contact}</span></div>
                  {em.info && <div className="ec-row"><span className="ec-key"><Info size={14} /> Info</span><span className="ec-val">{em.info}</span></div>}
                </div>
                <div className="ec-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => setRespond(em)}>Respond</button>
                  <button className="btn btn-outline btn-sm" onClick={() => setDetail(em)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Emergency Request Details"
        footer={<button className="btn btn-primary" onClick={() => setDetail(null)}>Close</button>}>
        {detail && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="ec-blood" style={{ width: 56, height: 56, fontSize: '1.1rem' }}>{detail.bloodGroup}</div>
              <StatusBadge status={detail.urgency} label={detail.urgency.toUpperCase()} />
            </div>
            <div className="profile-info-list">
              <div className="profile-info-row"><span className="pi-key">Hospital</span><span className="pi-val">{detail.hospital}</span></div>
              <div className="profile-info-row"><span className="pi-key">Location</span><span className="pi-val">{detail.location}</span></div>
              <div className="profile-info-row"><span className="pi-key">Units Needed</span><span className="pi-val">{detail.units}</span></div>
              <div className="profile-info-row"><span className="pi-key">Contact</span><span className="pi-val">{detail.contact}</span></div>
              <div className="profile-info-row"><span className="pi-key">Urgency</span><span className="pi-val">{detail.urgency}</span></div>
              <div className="profile-info-row"><span className="pi-key">Date Posted</span><span className="pi-val">{detail.date}</span></div>
            </div>
            {detail.info && <p className="text-muted mt-4" style={{ lineHeight: 1.6 }}>{detail.info}</p>}
          </div>
        )}
      </Modal>

      {/* Respond modal */}
      <Modal open={!!respond} onClose={() => setRespond(null)} title="Respond to Emergency Request"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setRespond(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleRespond}>Confirm Response</button>
          </>
        }>
        {respond && (
          <div>
            <p className="mb-4">You are about to respond to a <strong>{respond.urgency.toLowerCase()}</strong> blood request:</p>
            <div className="profile-info-list">
              <div className="profile-info-row"><span className="pi-key">Blood Group</span><span className="pi-val">{respond.bloodGroup}</span></div>
              <div className="profile-info-row"><span className="pi-key">Hospital</span><span className="pi-val">{respond.hospital}</span></div>
              <div className="profile-info-row"><span className="pi-key">Location</span><span className="pi-val">{respond.location}</span></div>
              <div className="profile-info-row"><span className="pi-key">Contact</span><span className="pi-val">{respond.contact}</span></div>
            </div>
            <div className="card" style={{ background: 'var(--neutral-50)', padding: 14, marginTop: 16, borderColor: 'var(--neutral-200)' }}>
              <div className="text-sm text-muted">Your blood group: <strong style={{ color: 'var(--primary-600)' }}>{user.bloodGroup}</strong> · Your status: <strong>{user.available ? 'Available' : 'Unavailable'}</strong></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
