import { motion } from 'framer-motion';
import styles from './Hero.module.css';

interface HeroProps {
  onInquireClick: () => void;
}

export function Hero({ onInquireClick }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.videoContainer}>
        <div className={styles.overlay}></div>
        <img 
          src="/images/wedding.jpg"
          alt="Better Days Studios Wedding Background"
          className={styles.video} 
        />
      </div>

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={styles.textContent}
        >
          <h1 className={styles.title}>BETTER DAYS STUDIOS</h1>
          <p className={styles.tagline}>Captivating Moments • Manifesting Better Days</p>
        </motion.div>

        <motion.button
          onClick={onInquireClick}
          className={styles.ctaButton}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
        >
          [ INQUIRE NOW ]
        </motion.button>
      </div>
    </section>
  );
}
