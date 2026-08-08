import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast/ToastContext';
import styles from './AdminDashboard.module.css';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const currentDate = new Date('2026-08-10T09:00:00Z');
  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.topRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back, Creative</h1>
          <p className={styles.subtitle}>{formattedDate} &middot; Better Days Studios Management</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search studio..." className={styles.searchInput} />
          </div>
          <button className={styles.notificationBtn} onClick={() => addToast('No new notifications.', 'info')}>
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard} onClick={() => navigate('/admin/projects')} style={{cursor: 'pointer'}}>
          <div className={styles.metricLabel}>Total Bookings</div>
          <div className={styles.metricValueGold}>47</div>
        </div>
        <div className={styles.metricCard} onClick={() => navigate('/admin/calendar')} style={{cursor: 'pointer'}}>
          <div className={styles.metricLabel}>Upcoming Prenups</div>
          <div className={styles.metricValue}>3</div>
        </div>
        <div className={styles.metricCard} onClick={() => navigate('/admin/calendar')} style={{cursor: 'pointer'}}>
          <div className={styles.metricLabel}>Upcoming Weddings</div>
          <div className={styles.metricValue}>5</div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Monthly Overview</h2>
          </div>
          <div className={styles.miniCalendar}>
            {/* Simple static representation of calendar for dashboard */}
            <div className={styles.miniCalendarGrid}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className={styles.mcHeader}>{d}</div>)}
              {Array.from({length: 31}).map((_, i) => (
                <div key={i} className={`${styles.mcDay} ${i+1 === 10 ? styles.mcToday : ''}`}>
                  {i + 1}
                  {(i+1 === 3 || i+1 === 7 || i+1 === 8) && <div className={styles.mcDot}></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Today's Schedule</h2>
            <div className={styles.datePill}>Aug 10</div>
          </div>
          <div className={styles.scheduleList}>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleTime}>
                <div className={styles.scheduleStart}>9:00 AM</div>
                <div className={styles.scheduleEnd}>11:30 AM</div>
              </div>
              <div className={styles.scheduleDetails}>
                <div className={styles.scheduleTitle}>Consultation: Garcia & Lim</div>
                <div className={styles.scheduleDesc}>Virtual Google Meet</div>
              </div>
            </div>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleTime}>
                <div className={styles.scheduleStart}>2:00 PM</div>
                <div className={styles.scheduleEnd}>4:30 PM</div>
              </div>
              <div className={styles.scheduleDetails}>
                <div className={styles.scheduleTitle}>Prenup shoot: Dela Cruz & Santos</div>
                <div className={styles.scheduleDesc}>Location: Intramuros, Manila</div>
              </div>
            </div>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleTime}>
                <div className={styles.scheduleStart}>5:00 PM</div>
                <div className={styles.scheduleEnd}>6:00 PM</div>
              </div>
              <div className={styles.scheduleDetails}>
                <div className={styles.scheduleTitle}>Final delivery: Reyes & Tan</div>
                <div className={styles.scheduleDesc}>Google Drive & USB Dispatch</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
