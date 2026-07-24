import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  isBefore, 
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Step2Date.module.css';

interface Step2DateProps {
  selectedDate: Date | null;
  setSelectedDate: (d: Date | null) => void;
  onNext: () => void;
  onBack: () => void;
}

type DateStatus = 'AVAILABLE' | 'BOOKED' | 'PENDING';

interface AvailabilityMap {
  [dateString: string]: DateStatus;
}

export function Step2Date({
  selectedDate,
  setSelectedDate,
  onNext,
  onBack
}: Step2DateProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchAvailability();
  }, [currentMonth]);

  const fetchAvailability = async () => {
    const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const endDate = format(endOfMonth(addMonths(currentMonth, 1)), 'yyyy-MM-dd');
    
    // Call the secure RPC function instead of querying the table directly
    const { data, error } = await supabase.rpc('get_public_availability', {
      start_date: startDate,
      end_date: endDate
    });
      
    if (error) {
      console.error('Error fetching availability:', error);
      return;
    }

    const newAvailability: AvailabilityMap = {};
    if (data) {
      data.forEach(booking => {
        // If there's already a CONFIRMED or COMPLETED booking, keep it as BOOKED.
        // Otherwise, if it's PENDING, set it as PENDING.
        const existing = newAvailability[booking.event_date];
        if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
          newAvailability[booking.event_date] = 'BOOKED';
        } else if (booking.status === 'PENDING' && existing !== 'BOOKED') {
          newAvailability[booking.event_date] = 'PENDING';
        }
      });
    }
    
    setAvailability(newAvailability);
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navBtn}>
          <ChevronLeft size={24} />
        </button>
        <span className={styles.monthLabel}>
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button onClick={nextMonth} className={styles.navBtn}>
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'E';
    const days = [];
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={styles.colCenter} key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className={styles.daysRow}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    const today = startOfDay(new Date());

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        const dateString = format(cloneDay, 'yyyy-MM-dd');
        const status = availability[dateString] || 'AVAILABLE';
        const isPast = isBefore(cloneDay, today);
        const isDisabled = isPast || status === 'BOOKED' || !isSameMonth(cloneDay, monthStart);
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        
        days.push(
          <div
            className={`
              ${styles.cell} 
              ${isDisabled ? styles.disabled : ''} 
              ${isSelected ? styles.selected : ''}
              ${status === 'PENDING' && !isDisabled ? styles.pending : ''}
              ${!isSameMonth(cloneDay, monthStart) ? styles.offMonth : ''}
              ${isSameDay(cloneDay, today) ? styles.today : ''}
            `}
            key={day.toString()}
            onClick={() => !isDisabled ? onDateClick(cloneDay) : null}
          >
            <span className={styles.number}>{formattedDate}</span>
            {status === 'PENDING' && !isDisabled && <div className={styles.pendingDot} />}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className={styles.row} key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className={styles.body}>{rows}</div>;
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 100 : -100,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 100 : -100,
        opacity: 0
      };
    }
  };

  return (
    <motion.div 
      className={styles.stepContainer}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className={styles.titleArea}>
        <button className={styles.backLink} onClick={onBack}>
          <ChevronLeft size={16} /> Back
        </button>
        <h3>Check availability</h3>
        <p>Choose your preferred date.</p>
      </div>

      <div className={styles.calendarContainer}>
        {renderHeader()}
        {renderDays()}
        
        <div className={styles.calendarBodyWrapper}>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentMonth.toString()}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -10000) {
                  nextMonth();
                } else if (swipe > 10000) {
                  prevMonth();
                }
              }}
            >
              {renderCells()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.dotAvailable}`}></div>
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.dotPending}`}></div>
          <span>Pending</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.dotBooked}`}></div>
          <span>Booked</span>
        </div>
      </div>

      <button 
        className={styles.nextBtn}
        disabled={!selectedDate}
        onClick={onNext}
      >
        Continue
      </button>
    </motion.div>
  );
}
