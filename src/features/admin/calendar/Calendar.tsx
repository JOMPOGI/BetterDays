import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Calendar.module.css';

export function Calendar() {
  const navigate = useNavigate();
  // Use August 2026 as the base date to match the screenshot
  const [currentDate, setCurrentDate] = useState(new Date('2026-08-01T00:00:00Z'));
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Hardcoded events matching the screenshot + 2026 Philippine Holidays
  const events = [
    // Client Events
    { id: '1', projectId: '1', date: '2026-08-03', title: 'Garcia Consultation', type: 'Consultation' },
    { id: '3', projectId: '2', date: '2026-08-07', title: 'Dela Cruz Prenup', type: 'Prenup' },
    { id: '4', projectId: '5', date: '2026-08-08', title: 'Santos Wedding', type: 'Wedding' },
    
    // 2026 Philippine Holidays
    { id: 'h1', projectId: '', date: '2026-01-01', title: 'New Year\'s Day', type: 'Holiday' },
    { id: 'h2', projectId: '', date: '2026-04-02', title: 'Maundy Thursday', type: 'Holiday' },
    { id: 'h3', projectId: '', date: '2026-04-03', title: 'Good Friday', type: 'Holiday' },
    { id: 'h4', projectId: '', date: '2026-04-09', title: 'Araw ng Kagitingan', type: 'Holiday' },
    { id: 'h5', projectId: '', date: '2026-05-01', title: 'Labor Day', type: 'Holiday' },
    { id: 'h6', projectId: '', date: '2026-06-12', title: 'Independence Day', type: 'Holiday' },
    { id: 'h7', projectId: '', date: '2026-08-21', title: 'Ninoy Aquino Day', type: 'Holiday' },
    { id: 'h8', projectId: '', date: '2026-08-31', title: 'National Heroes Day', type: 'Holiday' },
    { id: 'h9', projectId: '', date: '2026-11-01', title: 'All Saints\' Day', type: 'Holiday' },
    { id: 'h10', projectId: '', date: '2026-11-30', title: 'Bonifacio Day', type: 'Holiday' },
    { id: 'h11', projectId: '', date: '2026-12-08', title: 'Feast of the Immaculate Conception', type: 'Holiday' },
    { id: 'h12', projectId: '', date: '2026-12-25', title: 'Christmas Day', type: 'Holiday' },
    { id: 'h13', projectId: '', date: '2026-12-30', title: 'Rizal Day', type: 'Holiday' },
    { id: 'h14', projectId: '', date: '2026-12-31', title: 'Last Day of the Year', type: 'Holiday' },
  ];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const startDay = startOfMonth(currentDate).getDay();
  const emptyDays = Array.from({ length: startDay }).map((_, i) => i);

  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr);
  };

  const getEventClass = (type: string) => {
    switch (type) {
      case 'Consultation': return styles.eventConsultation;
      case 'Prenup': return styles.eventPrenup;
      case 'Wedding': return styles.eventWedding;
      case 'Holiday': return styles.eventHoliday;
      default: return styles.eventConsultation;
    }
  };

  const handleEventClick = (projectId: string) => {
    navigate(`/admin/projects/${projectId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.calendarHeader}>
        <div className={styles.monthNav}>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={prevMonth} className={styles.iconBtn}><ChevronLeft size={24} /></button>
          <button onClick={nextMonth} className={styles.iconBtn}><ChevronRight size={24} /></button>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.dotConsultation}`}></div> Consultation
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.dotPrenup}`}></div> Prenup
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.dotWedding}`}></div> Wedding
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.dotHoliday}`}></div> Holiday
            </div>
          </div>


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
            const dayEvents = getEventsForDay(day);
            const isTargetToday = format(day, 'yyyy-MM-dd') === '2026-08-03';
            
            return (
              <div key={day.toISOString()} className={styles.day}>
                <div className={styles.dayHeader}>
                  <div className={styles.dayNumber}>{format(day, 'd')}</div>
                  {isTargetToday && <div className={styles.todayPill}>TODAY</div>}
                </div>
                
                <div className={styles.dayBookings}>
                  {dayEvents.map(e => (
                    <div 
                      key={e.id} 
                      className={`${styles.eventBadge} ${getEventClass(e.type)}`}
                      onClick={() => handleEventClick(e.projectId)}
                    >
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
