import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './MediaLightbox.module.css';

interface MediaLightboxProps {
  media: { id: number; category: string; image: string } | null;
  onClose: () => void;
}

export function MediaLightbox({ media, onClose }: MediaLightboxProps) {
  if (!media) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.lightbox}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className={styles.topBar}>
          <span className={styles.category}>{media.category}</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          <motion.img 
            src={media.image} 
            alt={media.category}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
