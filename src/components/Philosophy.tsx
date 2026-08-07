import React from 'react';

import styles from './Philosophy.module.css';

export function Philosophy() {
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
    <section id="philosophy" className={styles.section}>
      <div className={styles.philosophy}>
        <div ref={setupRef} className={`${styles.philosophyCopy} reveal`}>
          <div className="eyebrow">The Studio</div>
          <h2>We don't just <em>document</em> weddings. We direct memory.</h2>
          <p>
            Better Days Studios was built on a simple belief: the way a day is remembered depends entirely on how it was seen. So we treat every wedding and every prenup story as a film first — composed, graded, and scored — not a highlight reel assembled after the fact.
          </p>
          <p>
            Elegant, timeless, unmistakably yours. Every love story arrives with its own rhythm, its own light, its own quiet moments worth holding onto — our job is to find them and keep them.
          </p>
          <div className={styles.philosophyStats}>
            <div>
              <div className={styles.statNum}>180+</div>
              <div className={styles.statLabel}>Films Delivered</div>
            </div>
            <div>
              <div className={styles.statNum}>9 yrs</div>
              <div className={styles.statLabel}>Behind the Lens</div>
            </div>
          </div>
        </div>
        <div ref={setupRef} className={`${styles.collage} reveal`}>
          <img src="/images/wedding.jpg" alt="Wedding Film" className={styles.img1} />
          <img src="/images/ring.jpg" alt="Details" className={styles.img2} />
        </div>
      </div>
    </section>
  );
}
