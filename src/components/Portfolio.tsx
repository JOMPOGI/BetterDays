import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaLightbox } from './MediaLightbox';
import styles from './Portfolio.module.css';

const categories = ['ALL', 'WEDDINGS', 'BIRTHDAYS & PARTIES', 'COMMERCIAL', 'PORTRAITS', 'STUDIO'];

const portfolioItems = [
  { id: 1, category: 'WEDDINGS', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop' },
  { id: 2, category: 'COMMERCIAL', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop' },
  { id: 3, category: 'PORTRAITS', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop' },
  { id: 4, category: 'WEDDINGS', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop' },
  { id: 5, category: 'BIRTHDAYS & PARTIES', image: 'https://images.unsplash.com/photo-1530103862676-de8892437659?q=80&w=1000&auto=format&fit=crop' },
  { id: 6, category: 'STUDIO', image: 'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?q=80&w=1000&auto=format&fit=crop' },
];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedMedia, setSelectedMedia] = useState<{ id: number; category: string; image: string } | null>(null);

  const filteredItems = activeCategory === 'ALL' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <>
      <section className={styles.portfolioSection}>
        <div className={styles.filtersWrapper}>
        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className={styles.grid}>
        <AnimatePresence>
          {filteredItems.map(item => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={item.id}
              className={styles.gridItem}
              onClick={() => setSelectedMedia(item)}
            >
              <img src={item.image} alt={item.category} loading="lazy" />
              <div className={styles.itemOverlay}>
                <span className={styles.itemCategory}>{item.category}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
    
    <MediaLightbox 
      media={selectedMedia} 
      onClose={() => setSelectedMedia(null)} 
    />
    </>
  );
}
