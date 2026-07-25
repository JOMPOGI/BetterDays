import { motion } from 'framer-motion';
import styles from './VisualShowcase.module.css';

const showcaseData = [
  { text: "Stories worth remembering.", img: "/images/wedding.jpg" },
  { text: "Made to be felt.", img: "/images/ring.jpg" }
];

export function VisualShowcase() {
  return (
    <section className={styles.showcaseSection}>
      {showcaseData.map((item, index) => (
        <div key={index} className={styles.showcaseBlock}>
          <motion.div 
            className={styles.imageWrapper}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <img src={item.img} alt="Showcase" loading="lazy" />
          </motion.div>
          
          <motion.div 
            className={styles.textWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className={styles.microCopy}>{item.text}</h3>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
