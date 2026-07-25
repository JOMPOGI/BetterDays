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
import { ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react';
import { BookingDetailsDrawer } from '../../components/Admin/BookingDetailsDrawer';
import styles from './Calendar.module.css';

export interface Booking {
  id: string;
  client_id: string;
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
  created_at: string;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [_loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSelectedBookingId(id);
      setIsDrawerOpen(true);
    }
  }, [searchParams]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data: bookingsData, error } = await supabase.from('bookings').select('*');
    const { data: clientsData } = await supabase.from('clients').select('*');
    const { data: inquiriesData } = await supabase.from('inquiries').select('*');

    if (error) {
      console.error('Error fetching bookings:', error);
    } else if (bookingsData) {
      const merged = bookingsData.map((b: any) => {
        const client = clientsData?.find((c: any) => c.id === b.client_id);
        const inquiry = inquiriesData?.find((i: any) => i.id === b.inquiry_id);
        return {
          ...b,
          client_name: client ? client.full_name : 'Unknown Client',
          service_type: inquiry ? inquiry.event_type : 'Event'
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

  const startDay = startOfMonth(currentDate).getDay();
  const emptyDays = Array.from({ length: startDay }).map((_, i) => i);

  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings
      .filter(b => b.event_date === dateStr)
      .sort((a, b) => {
        const typeA = (a.service_type || '').toLowerCase();
        const typeB = (b.service_type || '').toLowerCase();
        return typeA.localeCompare(typeB);
      });
  };

  // Chronological upcoming events list
  const upcomingEvents = bookings
    .filter(b => b.status !== 'CANCELLED' && new Date(b.event_date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => {
      const dateDiff = new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      if (dateDiff !== 0) return dateDiff;
      const typeA = (a.service_type || '').toLowerCase();
      const typeB = (b.service_type || '').toLowerCase();
      return typeA.localeCompare(typeB);
    });

  const openNewBooking = () => {
    setSelectedBookingId(null);
    setIsDrawerOpen(true);
  };

  const openBooking = (id: string) => {
    setSelectedBookingId(id);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = (wasUpdated: boolean) => {
    setIsDrawerOpen(false);
    setSelectedBookingId(null);
    if (wasUpdated) {
      fetchBookings();
    }
    if (searchParams.has('id')) {
      setSearchParams({});
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Schedule & Bookings</h1>
          <p>Manage your studio events and availability.</p>
        </div>
        <button className={styles.addBtn} onClick={openNewBooking}>
          <Plus size={18} />
          New Event
        </button>
      </div>

      <div className={styles.splitLayout}>
        {/* LEFT: CALENDAR */}
        <div className={styles.calendarArea}>
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
        </div>

        {/* RIGHT: UPCOMING EVENTS */}
        <div className={styles.eventsArea}>
          <h3>Upcoming Events</h3>
          <div className={styles.eventsList}>
            {upcomingEvents.length === 0 ? (
              <div className={styles.emptyEvents}>No upcoming events found.</div>
            ) : (
              upcomingEvents.map(event => (
                <div 
                  key={event.id} 
                  className={`${styles.eventCard} ${selectedBookingId === event.id ? styles.eventCardActive : ''}`}
                  onClick={() => openBooking(event.id)}
                >
                  <div className={styles.eventCardHeader}>
                    <h4>{event.client_name}</h4>
                    <span className={`${styles.statusBadge} ${styles[event.status.toLowerCase()]}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className={styles.eventCardBody}>
                    <p className={styles.eventType}>{event.service_type || 'Event'}</p>
                    <p className={styles.eventTime}>
                      {format(new Date(event.event_date), 'MMM d, yyyy')} 
                      {event.start_time && ` • ${event.start_time}`}
                    </p>
                    {event.location && (
                      <p className={styles.eventLocation}>
                        <MapPin size={12} /> {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <BookingDetailsDrawer 
          bookingId={selectedBookingId} 
          onClose={handleDrawerClose} 
        />
      )}
    </div>
  );
}
