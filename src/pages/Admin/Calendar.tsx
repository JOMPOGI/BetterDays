import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams } from 'react-router-dom';
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

    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .gte('event_date', start)
      .lte('event_date', end);

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data as Booking[] || []);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.monthNav}>
          <button onClick={prevMonth} className={styles.iconBtn}><ChevronLeft /></button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={nextMonth} className={styles.iconBtn}><ChevronRight /></button>
        </div>
        
        <button className={styles.addBtn} onClick={openNewBooking}>
          <Plus size={18} />
          New Booking
        </button>
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
