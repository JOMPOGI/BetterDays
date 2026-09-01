import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import styles from './Calendar.module.css';

const holidays: [string, string][] = [
  ['2026-01-01', "New Year's Day"], ['2026-04-02', 'Maundy Thursday'], ['2026-04-03', 'Good Friday'],
  ['2026-04-09', 'Araw ng Kagitingan'], ['2026-05-01', 'Labor Day'], ['2026-06-12', 'Independence Day'],
  ['2026-08-21', 'Ninoy Aquino Day'], ['2026-08-31', 'National Heroes Day'], ['2026-11-01', "All Saints' Day"],
  ['2026-11-30', 'Bonifacio Day'], ['2026-12-08', 'Feast of the Immaculate Conception'], ['2026-12-25', 'Christmas Day'],
  ['2026-12-30', 'Rizal Day'], ['2026-12-31', 'Last Day of the Year']
];

type Booking = {
  id: string;
  client_id?: string | null;
  package_type?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  prenup_date?: string | null;
  location?: string | null;
  prenup_location?: string | null;
  status?: string | null;
  clients?: { full_name?: string | null } | null;
};

const normalizePackage = (booking: Booking) => {
  const value = String(booking.package_type || booking.event_type || '').toLowerCase().replace(/[+\-]/g, '_').replace(/\s+/g, '_');
  return value;
};

const isActive = (status?: string | null) =>
  ['PENDING', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED'].includes(String(status || '').toUpperCase());

export function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, clients(full_name)')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Calendar bookings:', error);
      setBookings([]);
    } else {
      setBookings((data || []) as Booking[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel('admin-calendar-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, load)
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, []);

  const events = useMemo(() => {
    const result: Array<{ id: string; projectId: string; date: string; title: string; type: 'Wedding' | 'Prenup' | 'Holiday' }> = [];

    bookings.filter(b => isActive(b.status)).forEach(b => {
      const packageType = normalizePackage(b);
      const combo = packageType.includes('wedding') && packageType.includes('prenup');
      const prenupOnly = packageType === 'prenup' || packageType.includes('prenup_only');
      const weddingOnly = packageType === 'wedding' || packageType.includes('wedding_only');
      const hasWedding = combo || weddingOnly || (!prenupOnly && !packageType.includes('prenup'));
      const hasPrenup = combo || prenupOnly || Boolean(b.prenup_date);
      const name = b.clients?.full_name || 'Client';

      if (hasWedding && b.event_date) {
        result.push({ id: `${b.id}-wedding`, projectId: b.id, date: b.event_date, title: `${name} Wedding`, type: 'Wedding' });
      }
      if (hasPrenup) {
        const date = b.prenup_date || (prenupOnly ? b.event_date : null);
        if (date) result.push({ id: `${b.id}-prenup`, projectId: b.id, date, title: `${name} Prenup`, type: 'Prenup' });
      }
    });

    holidays.forEach(([date, title], i) => result.push({ id: `holiday-${i}`, projectId: '', date, title, type: 'Holiday' }));
    return result;
  }, [bookings]);

  const daysInMonth = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
  const emptyDays = Array.from({ length: startOfMonth(currentDate).getDay() });
  const getEventsForDay = (day: Date) => events.filter(event => event.date === format(day, 'yyyy-MM-dd'));
  const getEventClass = (type: string) => type === 'Prenup' ? styles.eventPrenup : type === 'Wedding' ? styles.eventWedding : styles.eventHoliday;

  const changeMonth = (amount: number) => setCurrentDate(month => (amount > 0 ? addMonths(month, amount) : subMonths(month, Math.abs(amount))));
  const jumpToMonth = (value: string) => {
    if (!value) return;
    const parsed = parseISO(`${value}-01`);
    if (!Number.isNaN(parsed.getTime())) setCurrentDate(startOfMonth(parsed));
  };

  return (
    <div className={styles.container}>
      <div className={styles.calendarHeader}>
        <div className={styles.monthNav}>
          <button onClick={() => changeMonth(-1)} className={styles.iconBtn} aria-label="Previous month"><ChevronLeft size={24} /></button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={() => changeMonth(1)} className={styles.iconBtn} aria-label="Next month"><ChevronRight size={24} /></button>
          <button onClick={() => setCurrentDate(startOfMonth(new Date()))} className={styles.todayBtn}>Today</button>
          <label className={styles.monthPicker} title="Choose any month">
            <CalendarDays size={17} />
            <input type="month" value={format(currentDate, 'yyyy-MM')} onChange={e => jumpToMonth(e.target.value)} aria-label="Choose month" />
          </label>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.legend}>
            <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.dotPrenup}`}></div> Prenup</div>
            <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.dotWedding}`}></div> Wedding</div>
            <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.dotHoliday}`}></div> Holiday</div>
          </div>
        </div>
      </div>

      <div className={styles.calendar}>
        <div className={styles.weekdays}>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className={styles.weekday}>{day}</div>)}</div>
        <div className={styles.daysGrid}>
          {emptyDays.map((_, i) => <div key={`empty-${i}`} className={styles.emptyDay}></div>)}
          {daysInMonth.map(day => {
            const dayEvents = getEventsForDay(day);
            return (
              <div key={day.toISOString()} className={styles.day}>
                <div className={styles.dayHeader}>
                  <div className={styles.dayNumber}>{format(day, 'd')}</div>
                  {format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && <div className={styles.todayPill}>TODAY</div>}
                </div>
                <div className={styles.dayBookings}>
                  {dayEvents.map(event => (
                    <div key={event.id} className={`${styles.eventBadge} ${getEventClass(event.type)}`} onClick={() => event.projectId && navigate(`/admin/projects/${event.projectId}`)}>
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {loading && <div style={{ padding: '0.75rem', color: 'var(--admin-text-muted)' }}>Loading bookings…</div>}
    </div>
  );
}
