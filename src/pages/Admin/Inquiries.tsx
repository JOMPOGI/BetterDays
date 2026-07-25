import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import styles from './Inquiries.module.css';
import { format } from 'date-fns';

export interface Inquiry {
  id: string;
  client_name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  project_notes: string | null;
  service_type: string;
  event_date: string;
  status: 'NEW' | 'CONTACTED' | 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'ARCHIVED';
  created_at: string;
}

export function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setInquiries(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);
    if (!error) {
      fetchInquiries(); // reload to reflect changes
    }
  };

  const filteredInquiries = filter === 'ALL' 
    ? inquiries 
    : inquiries.filter(i => i.status === filter);

  return (
    <div className={styles.container}>
      <button className="backBtn" onClick={() => navigate('/admin')}>
        &larr; Back to Dashboard
      </button>
      <div className={styles.header}>
        <div>
          <h1>Inquiries Inbox</h1>
          <p>Manage incoming requests and convert them to bookings.</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {['ALL', 'NEW', 'CONTACTED', 'PENDING', 'CONFIRMED', 'DECLINED'].map(f => (
            <button 
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <p className={styles.emptyState}>Loading inquiries...</p>
        ) : filteredInquiries.length === 0 ? (
          <p className={styles.emptyState}>No inquiries found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date Submitted</th>
                <th>Client</th>
                <th>Event Type</th>
                <th>Event Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inq) => (
                <tr key={inq.id}>
                  <td>{format(new Date(inq.created_at || new Date()), 'MMM d, yyyy')}</td>
                  <td>
                    <strong>{inq.client_name}</strong>
                    <br/>
                    <span className={styles.subtext}>{inq.email}</span>
                  </td>
                  <td>{inq.service_type}</td>
                  <td>{format(new Date(inq.event_date), 'MMM d, yyyy')}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[inq.status.toLowerCase()]}`}>
                      {inq.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className={styles.statusSelect}
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                    >
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Convert to Booking (Confirmed)</option>
                      <option value="DECLINED">Decline</option>
                      <option value="ARCHIVED">Archive</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
