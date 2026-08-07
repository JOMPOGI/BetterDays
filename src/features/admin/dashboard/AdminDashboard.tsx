import { useNavigate } from 'react-router-dom';
import { Calendar, Inbox, Users, Bell } from 'lucide-react';
import styles from './Home.module.css';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard Hub</h1>
        <p>Welcome to Better Days Studios Admin. Select a tool to begin.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card} onClick={() => navigate('/admin/calendar')}>
          <div className={styles.iconWrapper}><Calendar size={32} /></div>
          <div className={styles.content}>
            <h2>CRM / Calendar</h2>
            <p>Manage upcoming bookings, view availability, and schedule events.</p>
          </div>
        </div>

        <div className={styles.card} onClick={() => navigate('/admin/inquiries')}>
          <div className={styles.iconWrapper}><Inbox size={32} /></div>
          <div className={styles.content}>
            <h2>Inquiries</h2>
            <p>Check your inbox for new website requests and convert them to bookings.</p>
          </div>
        </div>

        <div className={styles.card} onClick={() => navigate('/admin/clients')}>
          <div className={styles.iconWrapper}><Users size={32} /></div>
          <div className={styles.content}>
            <h2>Clients</h2>
            <p>View your complete client directory and booking histories.</p>
          </div>
        </div>

        <div className={styles.card} onClick={() => navigate('/admin/notifications')}>
          <div className={styles.iconWrapper}><Bell size={32} /></div>
          <div className={styles.content}>
            <h2>Notifications</h2>
            <p>Stay updated on new activity, system alerts, and status changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
