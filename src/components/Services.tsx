import { motion } from 'framer-motion';
import styles from './Services.module.css';

const services = [
  { id: 'weddings', title: 'WEDDINGS', desc: 'Love, captured.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop' },
  { id: 'celebrations', title: 'CELEBRATIONS', desc: 'Every moment, unforgettable.', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1000&auto=format&fit=crop' },
  { id: 'commercial', title: 'COMMERCIAL', desc: 'Built to make an impression.', image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop' },
  { id: 'portraits', title: 'PORTRAITS & STUDIO', desc: 'Your story, in focus.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop' },
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
