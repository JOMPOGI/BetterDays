import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Step1Service.module.css';

export type Category = string | null;

interface Step1ServiceProps {
  category: Category;
  setCategory: (c: Category) => void;
  onNext: () => void;
}

export function Step1Service({
  category,
  setCategory,
  onNext
}: Step1ServiceProps) {
  const [selectedMain, setSelectedMain] = useState<string | null>(
    category && category !== 'Wedding' && category !== 'Prenup / Pre-Wedding' && category !== 'Other Event'
      ? 'Other Event' 
      : category
  );
  
  const [otherText, setOtherText] = useState(
    category && category !== 'Wedding' && category !== 'Prenup / Pre-Wedding' && category !== 'Other Event'
      ? category 
      : ''
  );

  const handleSelect = (val: string) => {
    setSelectedMain(val);
    if (val !== 'Other Event') {
      setCategory(val);
    } else {
      setCategory(otherText ? otherText : null);
    }
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOtherText(val);
    setCategory(val ? val : null);
  };

  const isComplete = selectedMain === 'Wedding' || selectedMain === 'Prenup / Pre-Wedding' || (selectedMain === 'Other Event' && otherText.trim().length > 0);

  return (
    <motion.div 
      className={styles.stepContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className={styles.splitLayout}>
        <div className={styles.howItWorksWrapper}>
          <h2 className={styles.sectionTitle}>HOW IT WORKS</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>01</span>
              <h4>CHECK YOUR DATE</h4>
              <p>Choose your preferred date and check availability.</p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>02</span>
              <h4>SHARE YOUR PLANS</h4>
              <p>Tell us about your event, date, location, and requirements.</p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>03</span>
              <h4>LET'S CONNECT</h4>
              <p>Submit your inquiry and we'll be in touch to discuss the details.</p>
            </div>
          </div>
        </div>

        <div className={styles.selectionWrapper}>
          <h3 className={styles.sectionTitle}>WHAT ARE YOU LOOKING FOR?</h3>
          <div className={styles.cardsGrid}>
            <button
              className={`${styles.selectionCard} ${selectedMain === 'Wedding' ? styles.selected : ''}`}
              onClick={() => handleSelect('Wedding')}
            >
              <div className={styles.radioCircle}>
                <div className={styles.radioInner}></div>
              </div>
              <div className={styles.cardContent}>
                <h4>WEDDING</h4>
                <p>Capture the moments that make your special day unforgettable.</p>
              </div>
            </button>
            
            <button
              className={`${styles.selectionCard} ${selectedMain === 'Prenup / Pre-Wedding' ? styles.selected : ''}`}
              onClick={() => handleSelect('Prenup / Pre-Wedding')}
            >
              <div className={styles.radioCircle}>
                <div className={styles.radioInner}></div>
              </div>
              <div className={styles.cardContent}>
                <h4>PRENUP / PRE-WEDDING</h4>
                <p>Celebrate your story with a session that reflects your unique connection.</p>
              </div>
            </button>
            
            <button
              className={`${styles.selectionCard} ${selectedMain === 'Other Event' ? styles.selected : ''}`}
              onClick={() => handleSelect('Other Event')}
            >
              <div className={styles.radioCircle}>
                <div className={styles.radioInner}></div>
              </div>
              <div className={styles.cardContent}>
                <h4>OTHER EVENT</h4>
                <p>Planning something else? Tell us about your event.</p>
              </div>
            </button>
          </div>

          <AnimatePresence>
            {selectedMain === 'Other Event' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.otherInputWrapper}
              >
                <label>What type of event are you planning?</label>
                <input
                  type="text"
                  placeholder="e.g. Birthday, Debut, Corporate Event, Baptism, or Other"
                  value={otherText}
                  onChange={handleOtherChange}
                  className={styles.otherInput}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button 
        className={styles.nextBtn}
        disabled={!isComplete}
        onClick={onNext}
      >
        CONTINUE
      </button>
    </motion.div>
  );
}
