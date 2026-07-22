import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  onInquireClick: () => void;
}

const images = [
  '/images/wedding.jpg',
  '/images/ring.jpg'
];

export function Hero({ onInquireClick }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.videoContainer}>
        <div className={styles.overlay}></div>
        <AnimatePresence initial={false}>
          <motion.img 
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt="Better Days Studios Background"
            className={styles.video} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AnimatePresence>
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
