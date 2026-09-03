import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { supabase } from '@/integrations/supabase/client';
import styles from './AdminDashboard.module.css';

const ACTIVE_STATUSES = ['PENDING', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED'];

type Booking = {
  id: string;
  client_id?: string | null;
  package_type?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  prenup_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  prenup_location?: string | null;
  status?: string | null;
  clients?: { full_name?: string | null } | null;
};

const packageType = (b: Booking) => String(b.package_type || b.event_type || '').toLowerCase().replace(/[+\-]/g, '_').replace(/\s+/g, '_');
const active = (b: Booking) => ACTIVE_STATUSES.includes(String(b.status || '').toUpperCase());
const isCombo = (b: Booking) => packageType(b).includes('wedding') && packageType(b).includes('prenup');
const isPrenup = (b: Booking) => isCombo(b) || packageType(b) === 'prenup' || packageType(b).includes('prenup_only') || Boolean(b.prenup_date);
const isWedding = (b: Booking) => isCombo(b) || packageType(b) === 'wedding' || packageType(b).includes('wedding_only') || (!packageType(b) && !isPrenup(b));

export function AdminDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const load = async () => {
    const { data, error } = await supabase.from('bookings').select('*, clients(full_name)').order('event_date', { ascending: true });
    if (error) console.error('Dashboard bookings:', error);
    setBookings((data || []) as Booking[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase.channel('admin-dashboard-bookings').on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, load).subscribe();
    const interval = window.setInterval(load, 15000);
    return () => { window.clearInterval(interval); void supabase.removeChannel(channel); };
  }, []);

  const upcomingWeddings = useMemo(() => bookings.filter(b => active(b) && isWedding(b) && !!b.event_date && b.event_date >= format(today, 'yyyy-MM-dd')), [bookings]);
  const upcomingPrenups = useMemo(() => bookings.filter(b => active(b) && isPrenup(b) && !!(b.prenup_date || (packageType(b) === 'prenup' ? b.event_date : null)) && (b.prenup_date || b.event_date)! >= format(today, 'yyyy-MM-dd')), [bookings]);

  const todays = useMemo(() => {
    const todayKey = format(today, 'yyyy-MM-dd');
    const result: Array<Booking & { displayType: 'Wedding' | 'Prenup'; displayDate: string }> = [];
    bookings.filter(active).forEach(b => {
      if (isWedding(b) && b.event_date === todayKey) result.push({ ...b, displayType: 'Wedding', displayDate: b.event_date });
      if (isPrenup(b) && (b.prenup_date || (packageType(b) === 'prenup' ? b.event_date : null)) === todayKey) result.push({ ...b, displayType: 'Prenup', displayDate: b.prenup_date || b.event_date! });
    });
    return result;
  }, [bookings, today]);

  const monthDays = useMemo(() => eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) }), [today]);
  const firstDay = startOfMonth(today).getDay();
  const hasEventOn = (day: Date) => bookings.some(b => active(b) && ((isWedding(b) && b.event_date === format(day, 'yyyy-MM-dd')) || (isPrenup(b) && (b.prenup_date || (packageType(b) === 'prenup' ? b.event_date : null)) === format(day, 'yyyy-MM-dd'))));

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.topRow}>
        <div className={styles.header}><h1 className={styles.title}>Welcome back, Creative</h1><p className={styles.subtitle}>{formattedDate} &middot; Better Days Studios Management</p></div>
        <div className={styles.headerActions}><div className={styles.searchWrapper}><Search size={18} className={styles.searchIcon} /><input type="text" placeholder="Search studio..." className={styles.searchInput} /></div><button className={styles.notificationBtn} onClick={() => addToast('Notifications are connected to Supabase.', 'info')}><Bell size={20} /></button></div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard} onClick={() => navigate('/admin/projects')} style={{ cursor: 'pointer' }}><div className={styles.metricLabel}>Total Bookings</div><div className={styles.metricValueGold}>{loading ? '—' : bookings.length}</div></div>
        <div className={styles.metricCard} onClick={() => navigate('/admin/calendar')} style={{ cursor: 'pointer' }}><div className={styles.metricLabel}>Upcoming Prenups</div><div className={styles.metricValue}>{loading ? '—' : upcomingPrenups.length}</div></div>
        <div className={styles.metricCard} onClick={() => navigate('/admin/calendar')} style={{ cursor: 'pointer' }}><div className={styles.metricLabel}>Upcoming Weddings</div><div className={styles.metricValue}>{loading ? '—' : upcomingWeddings.length}</div></div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}><h2 className={styles.panelTitle}>Monthly Overview</h2><div className={styles.datePill}>{format(today, 'MMMM yyyy')}</div></div>
          <div className={styles.miniCalendar}><div className={styles.miniCalendarGrid}>
            {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} className={styles.mcHeader}>{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {monthDays.map(day => <div key={day.toISOString()} className={`${styles.mcDay} ${isSameDay(day, today) ? styles.mcToday : ''}`}>{format(day, 'd')}{hasEventOn(day) && <div className={styles.mcDot}></div>}</div>)}
          </div></div>
        </div>
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}><h2 className={styles.panelTitle}>Today's Schedule</h2><div className={styles.datePill}>{format(today, 'MMM d')}</div></div>
          <div className={styles.scheduleList}>
            {todays.length === 0 ? <div className={styles.scheduleItem}><div className={styles.scheduleDetails}><div className={styles.scheduleTitle}>No events scheduled today</div><div className={styles.scheduleDesc}>Your Supabase bookings will appear here.</div></div></div> : todays.map((b, i) => <div className={styles.scheduleItem} key={`${b.id}-${b.displayType}-${i}`}><div className={styles.scheduleTime}><div className={styles.scheduleStart}>{b.start_time || '—'}</div><div className={styles.scheduleEnd}>{b.end_time || '—'}</div></div><div className={styles.scheduleDetails}><div className={styles.scheduleTitle}>{b.displayType}</div><div className={styles.scheduleDesc}>{b.location || b.prenup_location || 'No location provided'}</div></div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
