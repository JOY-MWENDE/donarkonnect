// Login page — mock auth with localStorage
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Droplet } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email address.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const res = login(email, password);
    if (!res.ok) {
      setErrors({ password: res.error });
      toast(res.error, 'error');
      return;
    }
    toast('Welcome back to DonorKonnect!', 'success');
    navigate('/dashboard');
  };

  const fillDemo = () => {
    setEmail('donor@example.com');
    setPassword('password123');
    toast('Demo credentials filled in.', 'info');
  };

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
          <h2>Welcome back to DonorKonnect</h2>
          <p className="aside-quote">Your donation can save a life. Sign in to manage your donations, availability, and respond to emergency blood requests.</p>
        </div>
        <div className="aside-stats">
          <div><div className="stat-num">5,200+</div><div className="stat-label">Active Donors</div></div>
          <div><div className="stat-num">12,000+</div><div className="stat-label">Lives Saved</div></div>
          <div><div className="stat-num">48</div><div className="stat-label">Hospitals</div></div>
        </div>
      </aside>

      <div className="auth-form-side">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <div className="auth-brand-mobile">
            <div className="brand-name">DonorKonnect</div>
            <div className="text-muted text-sm">Connecting Blood Donors. Saving Lives.</div>
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Sign In</h1>
          <p className="text-muted mb-6">Your donation can save a life.</p>

          <div className="form-group">
            <label htmlFor="email">Email <span className="req">*</span></label>
            <div className="password-wrap">
              <Mail size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--neutral-400)' }} />
              <input
                id="email" ref={emailRef} type="email" className={`input ${errors.email ? 'error' : ''}`}
                style={{ paddingLeft: 38 }} placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
              />
            </div>
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span className="req">*</span></label>
            <div className="password-wrap">
              <Lock size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--neutral-400)' }} />
              <input
                id="password" type={showPwd ? 'text' : 'password'} className={`input ${errors.password ? 'error' : ''}`}
                style={{ paddingLeft: 38, paddingRight: 40 }} placeholder="Enter your password"
                value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? 'Hide password' : 'Show password'}>
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="checkbox-row">
              <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); toast('Password reset is not available in this demo.', 'info'); }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">Sign In</button>

          <div className="text-center mt-4">
            <span className="text-muted text-sm">Don't have an account? </span>
            <Link to="/register">Create one</Link>
          </div>

          <div className="text-center mt-6">
            <button type="button" className="btn btn-outline btn-sm" onClick={fillDemo}>Use demo account</button>
            <p className="form-hint">donor@example.com · password123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
