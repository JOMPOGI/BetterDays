import { motion } from 'framer-motion';
import { useEffect } from 'react';
import styles from './LogoIntroAnimation.module.css';

interface LogoIntroAnimationProps {
  onComplete: () => void;
}

export function LogoIntroAnimation({ onComplete }: LogoIntroAnimationProps) {
  useEffect(() => {
    // Show logo for 2 seconds then fade out
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className={styles.introContainer}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.img 
        src="/images/logo.jpg" 
        alt="Better Days Studios" 
        className={styles.logo}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </motion.div>
  );
}
