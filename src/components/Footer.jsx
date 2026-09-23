// Footer — app footer
import { Droplet } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Droplet size={14} color="var(--primary-500)" fill="var(--primary-500)" />
        <strong>DonorKonnect</strong> — Connecting Blood Donors. Saving Lives. &copy; 2026
      </div>
    </footer>
  );
}
