import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import styles from './Inquiries.module.css';
import { format } from 'date-fns';

export interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
}

export interface Inquiry {
  id: string;
  client_id: string;
  client?: Client;
  event_type: string;
  event_date: string;
  status: 'PENDING' | 'CONTACTED' | 'QUOTED' | 'CONFIRMED' | 'COMPLETED' | 'DECLINED' | 'CANCELLED' | 'SPAM';
  created_at: string;
}

export function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: clientsData } = await supabase.from('clients').select('*');
    const { data: inquiriesData, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    
    if (!error && inquiriesData) {
      const merged = inquiriesData.map((inq: any) => ({
        ...inq,
        client: clientsData?.find((c: any) => c.id === inq.client_id)
      }));
      setInquiries(merged);
    }
    setLoading(false);
  };

  const handleStatusChange = async (inquiry: Inquiry, newStatus: string) => {
    const { error } = await supabase.from('inquiries').update({ status: newStatus }).eq('id', inquiry.id);
    
    if (!error) {
      if (newStatus === 'CONFIRMED') {
        // Create booking
        await supabase.from('bookings').insert({
          id: crypto.randomUUID(),
          inquiry_id: inquiry.id,
          client_id: inquiry.client_id,
          event_date: inquiry.event_date,
          start_time: (inquiry as any).start_time || '09:00',
          end_time: (inquiry as any).end_time || '18:00',
          location: (inquiry as any).location,
          status: 'CONFIRMED'
        });
      }
      fetchData(); // reload to reflect changes
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
          <h1>Inquiries Management</h1>
          <p>Review incoming requests and manage their lifecycle.</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {['ALL', 'PENDING', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'COMPLETED', 'DECLINED', 'CANCELLED', 'SPAM'].map(f => (
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
                    <strong>{inq.client?.full_name || 'Unknown Client'}</strong>
                    <br/>
                    <span className={styles.subtext}>{inq.client?.email || ''}</span>
                  </td>
                  <td>{inq.event_type}</td>
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
                      onChange={(e) => handleStatusChange(inq, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="QUOTED">Quoted</option>
                      <option value="CONFIRMED">Convert to Booking (Confirmed)</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="DECLINED">Declined</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="SPAM">Spam</option>
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
