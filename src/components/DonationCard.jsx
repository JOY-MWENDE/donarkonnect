// DonationCard — compact donation record card (mobile / list view)
import StatusBadge from './StatusBadge';
import { Building2, Calendar, Clock, Droplet, MapPin, Package } from 'lucide-react';

export default function DonationCard({ donation }) {
  return (
    <div className="record-card">
      <div className="rc-row"><span className="rc-key"><Building2 size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Hospital</span><span className="rc-val">{donation.hospital}</span></div>
      <div className="rc-row"><span className="rc-key"><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Date</span><span className="rc-val">{donation.date}</span></div>
      <div className="rc-row"><span className="rc-key"><Clock size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Time</span><span className="rc-val">{donation.time}</span></div>
      <div className="rc-row"><span className="rc-key"><Droplet size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Blood Group</span><span className="rc-val">{donation.bloodGroup}</span></div>
      <div className="rc-row"><span className="rc-key"><Package size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Units</span><span className="rc-val">{donation.units}</span></div>
      <div className="rc-row"><span className="rc-key"><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Location</span><span className="rc-val">{donation.location}</span></div>
      <div className="rc-row"><span className="rc-key">Status</span><span className="rc-val"><StatusBadge status={donation.status} /></span></div>
    </div>
  );
}
