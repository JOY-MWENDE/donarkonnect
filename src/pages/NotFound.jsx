// NotFound — 404 page
import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="empty-state" style={{ paddingTop: '15vh' }}>
      <div className="dc-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-500)', width: 72, height: 72, margin: '0 auto 24px', borderRadius: 20 }}>
        <Droplet size={32} />
      </div>
      <h1 style={{ fontSize: '3rem', marginBottom: 8 }}>404</h1>
      <h3 style={{ marginBottom: 8 }}>Page Not Found</h3>
      <p className="text-muted mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
    </div>
  );
}
