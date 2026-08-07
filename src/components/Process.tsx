import React from 'react';
import styles from './Process.module.css';

export function Process() {
  const setupRef = (node: HTMLElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(node);
  };

  return (
    <div className={styles.sectionDark}>
      <div ref={setupRef} className={`eyebrow reveal ${styles.goldEyebrow}`}>How We Work</div>
      <h2 ref={setupRef} className="reveal">From first call <em>to final cut.</em></h2>
      
      <div className={styles.processList}>
        <div ref={setupRef} className={`${styles.processItem} reveal`}>
          <div className={styles.pCode}>00:01</div>
          <div className={styles.pTitle}>Inquire</div>
          <div className={styles.pDesc}>Tell us your date, venue, and story. We reply within 48 hours with availability and a proposal built for your day..</div>
        </div>
        
        <div ref={setupRef} className={`${styles.processItem} reveal`}>
          <div className={styles.pCode}>00:02</div>
          <div className={styles.pTitle}>Plan</div>
          <div className={styles.pDesc}>A planning call to walk through pricing and package costs, discuss lighting and locations, and align on the overall tone — romantic, documentary, or somewhere in between.</div>
        </div>
        
        <div ref={setupRef} className={`${styles.processItem} reveal`}>
          <div className={styles.pCode}>00:03</div>
          <div className={styles.pTitle}>Film</div>
          <div className={styles.pDesc}>On the day, our team moves quietly in the background — two to three cinematographers capturing your day as it actually unfolds.</div>
        </div>
        
        <div ref={setupRef} className={`${styles.processItem} reveal`}>
          <div className={styles.pCode}>00:04</div>
          <div className={styles.pTitle}>Deliver</div>
          <div className={styles.pDesc}>Your Same-Day Edit (SDE) is ready on your wedding day, and your full wedding film- hand-edited and colour graded-is delivered within a week.</div>
        </div>
      </div>
    </div>
  );
}
