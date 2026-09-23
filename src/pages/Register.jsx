// Register page — creates a mock user in localStorage
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Droplet, User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function Register() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirm: '',
    bloodGroup: '', gender: '', phone: '', location: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.email) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.';
    if (!form.bloodGroup) e.bloodGroup = 'Please select your blood group.';
    if (!form.gender) e.gender = 'Please select your gender.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (!agree) e.agree = 'You must accept the terms and conditions.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast('Please fill in all required fields.', 'error');
      return;
    }
    const res = register(form);
    if (!res.ok) {
      toast(res.error, 'error');
      return;
    }
    toast('Account created successfully! Welcome to DonorKonnect.', 'success');
    navigate('/dashboard');
  };

  const inputIcon = (Icon) => (
    <Icon size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--neutral-400)' }} />
  );

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <div className="aside-brand">
          <div className="brand-mark"><Droplet size={28} fill="#fff" color="#fff" /></div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>DonorKonnect</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Connecting Blood Donors. Saving Lives.</div>
          </div>
        </div>
        <div>
          <h2>Become a Donor Today</h2>
          <p className="aside-quote">Join thousands of donors who are making a difference. Every drop counts. Register now and start saving lives.</p>
        </div>
        <div className="aside-stats">
          <div><div className="stat-num">8</div><div className="stat-label">Blood Types</div></div>
          <div><div className="stat-num">24/7</div><div className="stat-label">Support</div></div>
          <div><div className="stat-num">100%</div><div className="stat-label">Free</div></div>
        </div>
      </aside>

      <div className="auth-form-side">
        <form className="form-card" onSubmit={handleSubmit} noValidate style={{ maxWidth: 480 }}>
          <div className="auth-brand-mobile">
            <div className="brand-name">DonorKonnect</div>
            <div className="text-muted text-sm">Connecting Blood Donors. Saving Lives.</div>
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Create Account</h1>
          <p className="text-muted mb-6">Join the DonorKonnect community.</p>

          <div className="form-group">
            <label htmlFor="fullName">Full Name <span className="req">*</span></label>
            <div className="password-wrap">
              {inputIcon(User)}
              <input id="fullName" className={`input ${errors.fullName ? 'error' : ''}`} style={{ paddingLeft: 38 }}
                placeholder="Jane Doe" value={form.fullName} onChange={set('fullName')} />
            </div>
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email <span className="req">*</span></label>
            <div className="password-wrap">
              {inputIcon(Mail)}
              <input id="email" type="email" className={`input ${errors.email ? 'error' : ''}`} style={{ paddingLeft: 38 }}
                placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span className="req">*</span></label>
            <div className="password-wrap">
              {inputIcon(Lock)}
              <input id="password" type={showPwd ? 'text' : 'password'} className={`input ${errors.password ? 'error' : ''}`}
                style={{ paddingLeft: 38, paddingRight: 40 }} placeholder="Min. 6 characters"
                value={form.password} onChange={set('password')} />
              <button type="button" className="password-toggle" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? 'Hide password' : 'Show password'}>
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirm Password <span className="req">*</span></label>
            <div className="password-wrap">
              {inputIcon(Lock)}
              <input id="confirm" type={showPwd ? 'text' : 'password'} className={`input ${errors.confirm ? 'error' : ''}`}
                style={{ paddingLeft: 38 }} placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} />
            </div>
            {errors.confirm && <div className="form-error">{errors.confirm}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="bloodGroup">Blood Group <span className="req">*</span></label>
            <select id="bloodGroup" className={`select ${errors.bloodGroup ? 'error' : ''}`} value={form.bloodGroup} onChange={set('bloodGroup')}>
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.bloodGroup && <div className="form-error">{errors.bloodGroup}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender <span className="req">*</span></label>
            <select id="gender" className={`select ${errors.gender ? 'error' : ''}`} value={form.gender} onChange={set('gender')}>
              <option value="">Select gender</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.gender && <div className="form-error">{errors.gender}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number <span className="req">*</span></label>
            <div className="password-wrap">
              {inputIcon(Phone)}
              <input id="phone" className={`input ${errors.phone ? 'error' : ''}`} style={{ paddingLeft: 38 }}
                placeholder="07XXXXXXXX" value={form.phone} onChange={set('phone')} />
            </div>
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location <span className="req">*</span></label>
            <div className="password-wrap">
              {inputIcon(MapPin)}
              <input id="location" className={`input ${errors.location ? 'error' : ''}`} style={{ paddingLeft: 38 }}
                placeholder="City, Country" value={form.location} onChange={set('location')} />
            </div>
            {errors.location && <div className="form-error">{errors.location}</div>}
          </div>

          <div className="form-group">
            <div className="checkbox-row">
              <input id="terms" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <label htmlFor="terms">I agree to the Terms and Conditions and Privacy Policy.</label>
            </div>
            {errors.agree && <div className="form-error">{errors.agree}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">Create Account</button>

          <div className="text-center mt-4">
            <span className="text-muted text-sm">Already have an account? </span>
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
