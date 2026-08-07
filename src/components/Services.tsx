import React, { useEffect, useRef } from 'react';
import styles from './Services.module.css';

export function Services() {
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
      <div ref={setupRef} className={`eyebrow reveal ${styles.goldEyebrow}`}>What We Shoot</div>
      <h2 ref={setupRef} className="reveal">Two chapters. <em>One story.</em></h2>
      
      <div className={styles.servicesGrid}>
        <div ref={setupRef} className={`${styles.serviceCard} reveal`}>
          <div className={styles.serviceSlate}><span>A — MAIN FEATURE</span><span>FULL DAY</span></div>
          <h3>Wedding <em>Films</em></h3>
          <p>
            A cinematic feature of your ceremony and celebration — every vow, every glance, every toast — cut into a film built to be watched again on your tenth anniversary, and your fiftieth.
          </p>
          <div className={styles.serviceSpecs}>
            <div className={styles.specRow}><span>Delivery</span><span>Same Day Edit (SDE)</span></div>
          </div>
        </div>

        <div ref={setupRef} className={`${styles.serviceCard} reveal`}>
          <div className={styles.serviceSlate}><span>B — PRELUDE</span><span>HALF DAY</span></div>
          <h3>Prenup <em>Films</em></h3>
          <p>
            A short film shot before the wedding — unhurried, unscripted, and led by your story rather than a pose list. Often the opening scene of the feature still to come.
          </p>
          <div className={styles.serviceSpecs}>
            <div className={styles.specRow}><span>Delivery</span><span>3–5 Min Short Film</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
