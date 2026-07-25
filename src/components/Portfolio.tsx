import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { MediaLightbox } from './MediaLightbox';
import styles from './Portfolio.module.css';

const categories = ['ALL', 'WEDDINGS / PRENUPS', 'BIRTHDAYS & DEBUTS', 'CORPORATE EVENTS', 'WEDDING', 'PORTRAIT', 'COMMERCIAL'];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedMedia, setSelectedMedia] = useState<{ id: number; category: string; image: string } | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    const { data } = await supabase.from('portfolio').select('*');
    if (data && data.length > 0) {
      const mapped = data.map((item: any) => ({
        id: item.id,
        category: item.category.toUpperCase(),
        image: item.url
      }));
      setPortfolioItems(mapped);
    } else {
      // Fallback dummy data if nothing is in the db
      setPortfolioItems([
        { id: 1, category: 'WEDDING', image: '/images/wedding.jpg' },
        { id: 2, category: 'COMMERCIAL', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop' },
        { id: 3, category: 'PORTRAIT', image: 'https://images.unsplash.com/photo-1530103862676-de8892437659?q=80&w=1000&auto=format&fit=crop' },
        { id: 4, category: 'WEDDING', image: '/images/ring.jpg' }
      ]);
    }
  };

  const filteredItems = activeCategory === 'ALL' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory || item.category === activeCategory.replace('S', ''));

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
