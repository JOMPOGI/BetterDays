import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import styles from './Step4Success.module.css';
import type { Category } from './Step1Service';

interface Step4SuccessProps {
  category: Category;
  selectedDate: Date | null;
  location: string;
  onClose: () => void;
}

export function Step4Success({
  category,
  selectedDate,
  location,
  onClose
}: Step4SuccessProps) {
  
  return (
    <motion.div 
      className={styles.stepContainer}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className={styles.iconContainer}>
        <CheckCircle2 size={64} className={styles.icon} />
      </div>
      
      <h3>Your inquiry has been received.</h3>
      <p className={styles.subtitle}>Thank you. We'll be in touch soon.</p>

      <div className={styles.summaryCard}>
        <div className={styles.summaryRow}>
          <span className={styles.label}>Service</span>
          <span className={styles.value}>{category}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.label}>Date</span>
          <span className={styles.value}>
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.label}>Location</span>
          <span className={styles.value}>{location}</span>
        </div>
      </div>

      <button onClick={onClose} className={styles.closeBtn}>
        CLOSE PANEL
      </button>
    </motion.div>
  );
}
