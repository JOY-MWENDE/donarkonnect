// EmergencyButton — floating persistent button; tel: on mobile, modal on desktop
import { useState } from 'react';
import { PhoneCall } from 'lucide-react';
import Modal from './Modal';
import { EMERGENCY_NUMBER } from '../store';

export default function EmergencyButton() {
  const [open, setOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  const handleClick = () => {
    if (isMobile) {
      window.location.href = `tel:${EMERGENCY_NUMBER}`;
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <button className="emergency-fab" onClick={handleClick} aria-label="Call emergency number">
        <PhoneCall size={20} />
        Emergency
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Emergency Contact"
        footer={<button className="btn btn-primary" onClick={() => setOpen(false)}>Close</button>}>
        <div className="text-center" style={{ padding: '12px 0' }}>
          <div className="dc-icon" style={{ background: 'var(--error-50)', color: 'var(--error-500)', width: 64, height: 64, margin: '0 auto 16px', borderRadius: '50%' }}>
            <PhoneCall size={28} />
          </div>
          <p className="text-muted mb-4">For blood donation emergencies, call:</p>
          <a href={`tel:${EMERGENCY_NUMBER}`} className="btn btn-danger btn-lg" style={{ fontSize: '1.2rem' }}>
            <PhoneCall size={20} /> {EMERGENCY_NUMBER}
          </a>
          <p className="text-muted text-sm mt-4">Available 24/7 for urgent blood requests.</p>
        </div>
      </Modal>
    </>
  );
}
