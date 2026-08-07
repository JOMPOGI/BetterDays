
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
          <div className={styles.pTitle}>Book</div>
          <div className={styles.pDesc}>Share your wedding date, venue, and a little about your story. We'll reply within 48 hours with our availability and a proposal tailored to your celebration. If you're looking for photography as well, we're happy to connect you with one of our trusted photography partners.</div>
        </div>
        
        <div ref={setupRef} className={`${styles.processItem} reveal`}>
          <div className={styles.pCode}>00:02</div>
          <div className={styles.pTitle}>Plan</div>
          <div className={styles.pDesc}>We'll walk you through our video packages, discuss your timeline and preferences, and align on the style you envision—romantic, documentary, cinematic, or uniquely yours. If you've booked a partner photographer, we'll coordinate seamlessly with their team on the day.</div>
        </div>
        
        <div ref={setupRef} className={`${styles.processItem} reveal`}>
          <div className={styles.pCode}>00:03</div>
          <div className={styles.pTitle}>Film</div>
          <div className={styles.pDesc}>From your prenup session to your wedding day, we focus solely on crafting cinematic wedding films, working alongside your photographer to capture every genuine moment naturally.</div>
        </div>
        
        <div ref={setupRef} className={`${styles.processItem} reveal`}>
          <div className={styles.pCode}>00:04</div>
          <div className={styles.pTitle}>Deliver</div>
          <div className={styles.pDesc}>Your Same-Day Edit (SDE) is presented on your wedding day, while your full wedding film, hand-edited and color graded, is delivered within one week.</div>
        </div>
      </div>
    </div>
  );
}
