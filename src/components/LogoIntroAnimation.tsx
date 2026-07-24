import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './LogoIntroAnimation.module.css';

interface LogoIntroAnimationProps {
  onComplete: () => void;
}

export function LogoIntroAnimation({ onComplete }: LogoIntroAnimationProps) {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const visited = sessionStorage.getItem('introVisited');
    if (visited) {
      setShouldRender(false);
      onComplete();
      return;
    }

    sessionStorage.setItem('introVisited', 'true');

    // Show logo for 2.5 seconds then fade out
    const timer = setTimeout(() => {
      setShouldRender(false);
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!shouldRender) return null;

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
        initial={{ scale: 1.1, opacity: 0, filter: "blur(12px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </motion.div>
  );
}
