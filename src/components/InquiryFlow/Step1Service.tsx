import { motion } from 'framer-motion';
import styles from './Step1Service.module.css';

export type Category = 'Wedding / Prenups' | 'Birthday / Debuts' | 'Corporate' | null;

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
  
  const isComplete = category !== null;

  return (
    <motion.div 
      className={styles.stepContainer}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className={styles.splitLayout}>
        <div className={styles.tutorialBox}>
          <p className={styles.tutorialTitle}>HOW IT WORKS</p>
          <ol className={styles.tutorialList}>
            <li>Select your event category & check our calendar for date availability.</li>
            <li>Fill out the inquiry form with your details.</li>
            <li>Submit and wait for confirmation. Our studio will reach out to discuss your vision!</li>
          </ol>
        </div>

        <div className={styles.optionsContainer}>
          <h3>What are you looking for?</h3>
          <div className={styles.optionsGrid}>
            {(['Wedding / Prenups', 'Birthday / Debuts', 'Corporate'] as Category[]).map(c => (
              <button
                key={c}
                className={`${styles.optionBtn} ${category === c ? styles.selected : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        className={styles.nextBtn}
        disabled={!isComplete}
        onClick={onNext}
      >
        Continue
      </button>
    </motion.div>
  );
}
