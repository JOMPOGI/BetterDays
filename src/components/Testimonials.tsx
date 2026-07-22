import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    id: 1,
    name: 'Janssen Jeremy Co',
    text: 'It has been a year since we got Better Days as our videographer and we still love looking at our vids. You can still see and feel the cheesiness and sweetness of those special days. We love the small candid takes that they got for us being immersed in ourselves which is what we mostly wanted. It shows our kind of love that defines how we are as a couple. Highly recommended 5/5.',
  },
  {
    id: 2,
    name: 'Nina Soldevilla Ledesma',
    text: 'If you’re looking for an amazing video team, Better Days Studio should be at the top of your list! I’m forever grateful to them for capturing our once-in-a-lifetime moments so beautifully. From our prenup to our wedding day, they highlighted every special detail with such care and creativity. The entire team’s dedication and talent truly shined through, and choosing them was one of the best decisions we made—no regrets at all! 🥹♥️',
  },
  {
    id: 3,
    name: 'Camille Zerna',
    text: 'Our dream wedding would not be possible without the hardwork and patience that Jayfill\'s team given to us. From the bottom of our hearts, thank you guys! You never let us down since day 1, from prenup up to the wedding day. The service you\'ve given us is beyond our expectations. Alam nyo na ha? Sa maternity shoot ko, our baby\'s christening and birthdays, kayo ulit please! ♥️♥️♥️ Pa-family portrait nadin haha',
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>KIND WORDS</h2>
          <p>What our clients say about us</p>
        </div>

        <div className={styles.carousel}>
          <button onClick={prev} className={styles.navBtn} aria-label="Previous testimonial">
            <ChevronLeft size={32} />
          </button>
          
          <div className={styles.testimonialWrapper}>
            <Quote size={48} className={styles.quoteIcon} />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={styles.testimonialContent}
              >
                <p className={styles.text}>"{testimonials[currentIndex].text}"</p>
                <p className={styles.author}>— {testimonials[currentIndex].name}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button onClick={next} className={styles.navBtn} aria-label="Next testimonial">
            <ChevronRight size={32} />
          </button>
        </div>
        
        <div className={styles.dots}>
          {testimonials.map((_, idx) => (
            <button 
              key={idx} 
              className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
