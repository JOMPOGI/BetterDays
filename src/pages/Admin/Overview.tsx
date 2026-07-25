import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import styles from './Overview.module.css';

interface InquirySummary {
  id: string;
  client_name: string;
  event_date: string;
  service_type: string;
  location: string;
  status: string;
}

export function Overview() {
  const [inquiries, setInquiries] = useState<InquirySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inquiries')
      .select('id, client_name, event_date, service_type, location, status')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error('Error fetching overview:', error);
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  };

  const pending = inquiries.filter(i => i.status === 'PENDING');
  const confirmed = inquiries.filter(i => i.status === 'CONFIRMED');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Overview</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard} onClick={() => navigate('/admin/calendar')}>
          <h3>New / Pending</h3>
          <p className={styles.statNumber}>{pending.length}</p>
        </div>
        <div className={styles.statCard} onClick={() => navigate('/admin/calendar')}>
          <h3>Confirmed</h3>
          <p className={styles.statNumber}>{confirmed.length}</p>
        </div>
      </div>

      <div className={styles.recentSection}>
        <h2>Recent Inquiries & Bookings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.list}>
            {inquiries.length === 0 ? (
              <p>No recent inquiries found.</p>
            ) : (
              inquiries.map((item) => (
                <div 
                  key={item.id} 
                  className={styles.listItem}
                  onClick={() => navigate(`/admin/calendar?id=${item.id}`)}
                >
                  <div className={styles.itemHeader}>
                    <strong>{item.client_name}</strong>
                    <span className={`${styles.statusBadge} ${styles[item.status.toLowerCase()]}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className={styles.itemDetails}>
                    <span>{format(new Date(item.event_date), 'MMMM d, yyyy')}</span>
                    <span>•</span>
                    <span>{item.service_type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
