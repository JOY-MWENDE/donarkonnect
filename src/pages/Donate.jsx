// Donate page — availability toggle + donation recording form
import { useState } from 'react';
import { Droplet, CheckCircle2, Building2, Calendar, Clock, MapPin, Package } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import StatusBadge from '../components/StatusBadge';
import { addDonation, addNotification, formatDate, eligibleDate } from '../store';

const HOSPITALS = [
  'Kenyatta National Hospital',
  'Aga Khan University Hospital',
  'Mater Hospital',
  'Nairobi Hospital',
  'Mama Lucy Kibaki Hospital',
  'Karen Hospital',
  'Other',
];

export default function Donate() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    hospital: '', date: '', time: '', bloodGroup: user.bloodGroup, units: 1, location: user.location,
  });
  const [errors, setErrors] = useState({});

  if (!user) return null;

  const toggleAvailability = () => {
    const updated = { ...user, available: !user.available };
    updateProfile(updated);
    toast(`Your donation availability has been updated to ${updated.available ? 'Available' : 'Unavailable'}.`, 'success');
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.hospital) e.hospital = 'Please select a hospital.';
    if (!form.date) e.date = 'Donation date is required.';
    if (!form.time) e.time = 'Donation time is required.';
    if (!form.bloodGroup) e.bloodGroup = 'Blood group is required.';
    if (!form.units || form.units < 1) e.units = 'Units must be at least 1.';
    if (!form.location.trim()) e.location = 'Location is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast('Please fill in all required fields.', 'error');
      return;
    }
    addDonation(form);
    const updated = { ...user, lastDonation: form.date, available: false };
    updateProfile(updated);
    addNotification({
      title: 'Successful Donation',
      message: `Your donation of ${form.units} unit(s) of ${form.bloodGroup} blood at ${form.hospital} has been recorded. Thank you!`,
      type: 'success',
    });
    toast('Your donation has been recorded successfully.', 'success');
    setForm({ hospital: '', date: '', time: '', bloodGroup: user.bloodGroup, units: 1, location: user.location });
  };

  const nextEligible = eligibleDate(user.lastDonation);

  return (
    <div>
      <div className="page-header">
        <h1>Donate Blood</h1>
        <p>Manage your availability and record your donations.</p>
      </div>

      {/* Availability section */}
      <div className="card card-pad section-gap">
        <h3 className="mb-4">Are you currently available to donate blood?</h3>
        <div className="flex items-center gap-4 mb-6" style={{ flexWrap: 'wrap' }}>
          <div className="flex items-center gap-3">
            <span className="text-muted text-sm">Current Status:</span>
            <StatusBadge status={user.available ? 'available' : 'unavailable'} label={user.available ? 'Available' : 'Not Available'} />
          </div>
          <button className={`btn ${user.available ? 'btn-outline' : 'btn-success'}`} onClick={toggleAvailability}>
            <CheckCircle2 size={18} /> {user.available ? 'Mark as Unavailable' : 'Mark as Available'}
          </button>
        </div>
        <div className="card" style={{ background: 'var(--neutral-50)', padding: 16, borderColor: 'var(--neutral-200)' }}>
          <div className="text-sm text-muted">
            {user.available ? (
              <>You are currently <strong style={{ color: 'var(--success-600)' }}>available</strong> to donate blood. Hospitals can see your status and may contact you for emergency requests.</>
            ) : (
              <>You are currently <strong style={{ color: 'var(--neutral-600)' }}>unavailable</strong>. You won't receive emergency request notifications until you mark yourself available.</>
            )}
          </div>
          {user.lastDonation && (
            <div className="text-sm mt-2 text-muted">
              Last donation: <strong>{formatDate(user.lastDonation)}</strong> · Next eligible: <strong>{formatDate(nextEligible)}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Donation form */}
      <div className="card card-pad">
        <div className="flex items-center gap-3 mb-6">
          <div className="dc-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-500)', margin: 0 }}><Droplet size={24} /></div>
          <div>
            <h3 style={{ marginBottom: 0 }}>Record a Donation</h3>
            <p className="text-muted text-sm">Fill in the details of your blood donation.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="form-group">
              <label htmlFor="hospital">Hospital <span className="req">*</span></label>
              <select id="hospital" className={`select ${errors.hospital ? 'error' : ''}`} value={form.hospital} onChange={set('hospital')}>
                <option value="">Select hospital</option>
                {HOSPITALS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              {errors.hospital && <div className="form-error">{errors.hospital}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="date">Donation Date <span className="req">*</span></label>
              <input id="date" type="date" className={`input ${errors.date ? 'error' : ''}`} value={form.date} onChange={set('date')} max={new Date().toISOString().slice(0, 10)} />
              {errors.date && <div className="form-error">{errors.date}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="time">Donation Time <span className="req">*</span></label>
              <input id="time" type="time" className={`input ${errors.time ? 'error' : ''}`} value={form.time} onChange={set('time')} />
              {errors.time && <div className="form-error">{errors.time}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group <span className="req">*</span></label>
              <select id="bloodGroup" className={`select ${errors.bloodGroup ? 'error' : ''}`} value={form.bloodGroup} onChange={set('bloodGroup')}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.bloodGroup && <div className="form-error">{errors.bloodGroup}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="units">Units Donated <span className="req">*</span></label>
              <input id="units" type="number" min="1" max="5" className={`input ${errors.units ? 'error' : ''}`} value={form.units} onChange={set('units')} />
              {errors.units && <div className="form-error">{errors.units}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location <span className="req">*</span></label>
              <input id="location" className={`input ${errors.location ? 'error' : ''}`} placeholder="City" value={form.location} onChange={set('location')} />
              {errors.location && <div className="form-error">{errors.location}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            <Droplet size={20} /> Submit Donation
          </button>
        </form>
      </div>
    </div>
  );
}
