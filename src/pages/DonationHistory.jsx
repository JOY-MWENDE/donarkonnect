// DonationHistory — table (desktop) + cards (mobile) with search, filter, sort
import { useState, useMemo } from 'react';
import { Search, Droplet, Filter, ArrowUpDown } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import DonationCard from '../components/DonationCard';
import { getDonations } from '../store';

export default function DonationHistory() {
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [sort, setSort] = useState('newest');

  const donations = getDonations();

  const filtered = useMemo(() => {
    let list = [...donations];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) =>
        d.hospital.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.bloodGroup.toLowerCase().includes(q)
      );
    }
    if (bloodFilter) list = list.filter((d) => d.bloodGroup === bloodFilter);
    list.sort((a, b) => {
      const da = new Date(a.date), db = new Date(b.date);
      return sort === 'newest' ? db - da : da - db;
    });
    return list;
  }, [donations, search, bloodFilter, sort]);

  const totalUnits = donations.reduce((sum, d) => sum + d.units, 0);

  return (
    <div>
      <div className="page-header">
        <h1>Donation History</h1>
        <p>Track all your blood donations over time.</p>
      </div>

      {/* Summary */}
      <div className="cards-grid section-gap">
        <div className="dash-card">
          <div className="dc-label">Total Donations</div>
          <div className="dc-value">{donations.length}</div>
        </div>
        <div className="dash-card">
          <div className="dc-label">Total Units</div>
          <div className="dc-value">{totalUnits}</div>
        </div>
        <div className="dash-card">
          <div className="dc-label">Blood Group</div>
          <div className="dc-value">{donations[0]?.bloodGroup || '—'}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input className="input" placeholder="Search hospital, location..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search donations" />
        </div>
        <select className="select" value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)} aria-label="Filter by blood group">
          <option value="">All Blood Groups</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort donations">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Table (desktop) */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <Droplet size={48} className="es-icon" color="var(--neutral-300)" />
          <p>No donations found matching your filters.</p>
        </div>
      ) : (
        <>
          <div className="table-wrap hidden-mobile">
            <table className="table">
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.hospital}</td>
                    <td>{d.date}</td>
                    <td>{d.time}</td>
                    <td><span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{d.bloodGroup}</span></td>
                    <td>{d.units}</td>
                    <td>{d.location}</td>
                    <td><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile) */}
          <div className="hidden-desktop">
            {filtered.map((d) => <DonationCard key={d.id} donation={d} />)}
          </div>
        </>
      )}
    </div>
  );
}
