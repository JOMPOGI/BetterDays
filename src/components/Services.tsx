import { motion } from 'framer-motion';
import styles from './Services.module.css';

const services = [
  { id: 'wedding', title: 'WEDDING', desc: 'Love, captured.', image: '/images/wedding.jpg' },
  { id: 'prenup', title: 'PRENUP', desc: 'The beginning of forever.', image: '/images/ring.jpg' },
];

export function Services() {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.grid}>
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            className={styles.card}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          >
            <div className={styles.imageContainer}>
              <img src={service.image} alt={service.title} loading="lazy" />
              <div className={styles.overlay}></div>
            </div>
            <div className={styles.textContent}>
              <h2>{service.title}</h2>
              <p>{service.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
