import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './InquiryPanel.module.css';

interface InquiryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InquiryPanel({ isOpen, onClose }: InquiryPanelProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.panel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h2>INQUIRE</h2>
              <button onClick={onClose} className={styles.closeBtn} aria-label="Close inquiry panel">
                <X size={24} />
              </button>
            </div>

            <div className={styles.content}>
              {submitted ? (
                <div className={styles.successMessage}>
                  <p>Thank you. We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.field}>
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" required />
                  </div>
                  
                  <div className={styles.field}>
                    <label htmlFor="contact">Email Address / Phone Number</label>
                    <input type="text" id="contact" required />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="social">Social Handle (@Instagram / @TikTok)</label>
                    <input type="text" id="social" />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="date">Event / Shoot Date</label>
                    <input type="date" id="date" />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="location">Location / Venue Name</label>
                    <input type="text" id="location" />
                  </div>

                  <div className={styles.field}>
                    <label>Event Category</label>
                    <div className={styles.radioGroup}>
                      <label><input type="radio" name="category" value="Wedding" required /> Wedding</label>
                      <label><input type="radio" name="category" value="Birthday" /> Birthday / Party</label>
                      <label><input type="radio" name="category" value="Commercial" /> Commercial</label>
                      <label><input type="radio" name="category" value="Studio" /> Studio</label>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Service Type</label>
                    <div className={styles.radioGroup}>
                      <label><input type="radio" name="service" value="Photography" required /> Photography</label>
                      <label><input type="radio" name="service" value="Videography" /> Videography</label>
                      <label><input type="radio" name="service" value="Both" /> Both</label>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="notes">Project Notes</label>
                    <textarea id="notes" rows={3}></textarea>
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    SEND INQUIRY
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
