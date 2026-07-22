import { motion } from 'framer-motion';
import styles from './VisualShowcase.module.css';

const showcaseData = [
  { text: "Stories worth remembering.", img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2000&auto=format&fit=crop" },
  { text: "Made to be felt.", img: "https://images.unsplash.com/photo-1516280440544-712818cb4fb7?q=80&w=2000&auto=format&fit=crop" },
  { text: "Every frame. Every feeling.", img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop" },
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
