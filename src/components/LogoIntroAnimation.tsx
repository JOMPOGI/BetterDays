import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './LogoIntroAnimation.module.css';

interface LogoIntroAnimationProps {
  onComplete: () => void;
}

export function LogoIntroAnimation({ onComplete }: LogoIntroAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  
  useEffect(() => {
    // Check if user has visited before to skip or shorten animation
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      // Optional: fast-forward or skip for returning users.
      // For this implementation, we will still show a fast version.
    }
    sessionStorage.setItem('hasVisited', 'true');
    
    // Auto complete after animation sequence
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete();
    }, 4500); // Sequence duration
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isAnimating) return null;

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: custom * 0.5, duration: 1 },
        opacity: { delay: custom * 0.5, duration: 0.2 }
      }
    })
  };

  return (
    <motion.div 
      className={styles.introContainer}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3.5, duration: 1 }}
    >
      <div className={styles.logoWrapper}>
        <svg viewBox="0 0 200 200" className={styles.svgLogo}>
          {/* Geometric 'B' */}
          <motion.path
            d="M 50 150 L 50 50 L 100 50 C 120 50, 120 100, 100 100 C 130 100, 130 150, 100 150 Z"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            custom={0}
            variants={pathVariants}
            initial="hidden"
            animate="visible"
          />
          {/* Geometric 'D' interlocking */}
          <motion.path
            d="M 75 150 L 75 100 L 125 100 C 160 100, 160 150, 125 150 Z"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            custom={1}
            variants={pathVariants}
            initial="hidden"
            animate="visible"
          />
        </svg>
        
        <motion.div
          className={styles.wordmark}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
        >
          <div className={styles.betterDays}>BETTER DAYS</div>
          <motion.div 
            className={styles.studios}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            STUDIOS
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
