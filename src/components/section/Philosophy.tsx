

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
          <h2>Founded in December 2008, Better Days Studios was created with a simple yet powerful vision.</h2>
          <p className={styles.leadText}>
            <strong className={styles.highlight}>To capture love stories</strong> in their <strong className={styles.highlight}>most genuine and beautiful form</strong>.
          </p>
          <p>
            While the name was established in <strong className={styles.highlight}>2008</strong>, the true journey began in <strong className={styles.highlight}>2020</strong>, when the <strong className={styles.highlight}>passion for wedding storytelling</strong> fully came to life.
          </p>
          <p>
            Better Days Studios is a <strong className={styles.highlight}>Filipino wedding videography brand</strong> dedicated to <strong className={styles.highlight}>preserving the heartfelt moments</strong> of every couple's special day. From the <strong className={styles.highlight}>quiet anticipation before the ceremony</strong> to the <strong className={styles.highlight}>joyful celebration at the reception</strong>, every detail is carefully documented to let couples relive the <strong className={styles.highlight}>emotions, laughter, tears, and love</strong> that made their wedding unforgettable.
          </p>
          <p>
            We believe that <strong className={styles.highlight}>a wedding is more than just an event — it is a story</strong>. A <strong className={styles.highlight}>once-in-a-lifetime moment</strong> filled with <strong className={styles.highlight}>raw emotions and meaningful connections</strong>. Our mission is to turn those moments into <strong className={styles.highlight}>timeless films</strong> that allow couples to feel how beautiful their wedding day truly was, again and again.
          </p>
        </div>
        <div ref={setupRef} className={`${styles.logoContainer} reveal`}>
          <img src="/images/logo.jpg" alt="Better Days Studios Logo" className={styles.logoImage} />
        </div>
      </div>
    </section>
  );
}
