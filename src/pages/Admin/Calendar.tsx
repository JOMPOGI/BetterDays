import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { BookingDetailsModal } from '../../components/Admin/BookingDetailsModal';
import styles from './Calendar.module.css';

export interface Booking {
  id: string;
  client_name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  project_notes: string | null;
  service_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  source: string;
  admin_notes: string | null;
  created_at: string;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings(currentDate);
  }, [currentDate]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSelectedBookingId(id);
      setIsModalOpen(true);
      // Optional: Clean up URL after opening
      // setSearchParams({});
    }
  }, [searchParams]);

  const fetchBookings = async (date: Date) => {
    setLoading(true);
    const start = format(startOfMonth(date), 'yyyy-MM-dd');
    const end = format(endOfMonth(date), 'yyyy-MM-dd');

    const { data: bookingsData, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('event_date', start)
      .lte('event_date', end);

    const { data: clientsData } = await supabase.from('clients').select('*');

    if (error) {
      console.error('Error fetching bookings:', error);
    } else if (bookingsData) {
      const merged = bookingsData.map((b: any) => {
        const client = clientsData?.find((c: any) => c.id === b.client_id);
        return {
          ...b,
          client_name: client ? client.full_name : 'Unknown Client'
        };
      });
      setBookings(merged as Booking[]);
    }
    setLoading(false);
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // Calculate empty days at the start to align with weekday columns (Sunday start)
  const startDay = startOfMonth(currentDate).getDay();
  const emptyDays = Array.from({ length: startDay }).map((_, i) => i);

  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(b => b.event_date === dateStr);
  };

  const openNewBooking = () => {
    setSelectedBookingId(null); // Indicates a new manual booking
    setIsModalOpen(true);
  };

  const openBooking = (id: string) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  const handleModalClose = (wasUpdated: boolean) => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
    if (wasUpdated) {
      fetchBookings(currentDate); // Refresh if changes were saved
    }
    if (searchParams.has('id')) {
      setSearchParams({});
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;

  return (
    <div className={styles.container}>
      <button className="backBtn" onClick={() => navigate('/admin')}>
        &larr; Back to Dashboard
      </button>
      <div className={styles.header}>
        <div>
          <h1>CRM / Calendar</h1>
          <p>Manage your bookings and schedule.</p>
        </div>
        <button className={styles.addBtn} onClick={openNewBooking}>
          <Plus size={18} />
          New Booking
        </button>
      </div>

      <div className={styles.quickStats}>
        <div className={styles.statCard}>
          <h3>Pending Bookings</h3>
          <p>{pendingBookings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Confirmed this Month</h3>
          <p>{confirmedBookings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Upcoming Events</h3>
          <p>{bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.event_date) >= new Date()).length}</p>
        </div>
      </div>

      <div className={styles.calendarHeader}>
        <div className={styles.monthNav}>
          <button onClick={prevMonth} className={styles.iconBtn}><ChevronLeft /></button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={nextMonth} className={styles.iconBtn}><ChevronRight /></button>
        </div>
      </div>

      <div className={styles.calendar}>
        <div className={styles.weekdays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={styles.weekday}>{day}</div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {emptyDays.map(empty => (
            <div key={`empty-${empty}`} className={styles.emptyDay}></div>
          ))}
          
          {daysInMonth.map(day => {
            const dayBookings = getBookingsForDay(day);
            return (
              <div 
                key={day.toISOString()} 
                className={`${styles.day} ${isToday(day) ? styles.today : ''}`}
              >
                <div className={styles.dayNumber}>{format(day, 'd')}</div>
                
                <div className={styles.dayBookings}>
                  {dayBookings.map(b => (
                    <div 
                      key={b.id} 
                      className={`${styles.bookingBadge} ${styles[b.status.toLowerCase()]}`}
                      onClick={() => openBooking(b.id)}
                    >
                      {b.client_name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <BookingDetailsModal 
          bookingId={selectedBookingId} 
          onClose={handleModalClose} 
        />
      )}
    </div>
  );
}
