
import styles from './Testimonials.module.css';

export function Testimonials() {
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
    <div style={{ padding: '0 6vw' }}>
      <div ref={setupRef} className="eyebrow reveal">In Their Words</div>
      <h2 ref={setupRef} className="reveal">Subtitled by <em>the couples</em> who lived it.</h2>
      
      <div className={styles.testimonialTrack}>
        <div ref={setupRef} className={`${styles.testimonial} reveal`}>
          <p>"It has been a year since we got Better Days as our videographer and we still love looking at our vids. You can still see and feel the cheesiness and sweetness of those special days. We love the small candid takes that they got for us being immersed in ourselves which is what we mostly wanted. It shows our kind of love that defines how we are as a couple. Highly recommended 5/5."</p>
          <div className={styles.who}>Janssen Jeremy Co</div>
        </div>
        
        <div ref={setupRef} className={`${styles.testimonial} reveal`}>
          <p>"If you’re looking for an amazing video team, Better Days Studio should be at the top of your list! I’m forever grateful to them for capturing our once-in-a-lifetime moments so beautifully. From our prenup to our wedding day, they highlighted every special detail with such care and creativity. The entire team’s dedication and talent truly shined through, and choosing them was one of the best decisions we made—no regrets at all! 🥹♥️"</p>
          <div className={styles.who}>Nina Soldevilla Ledesma</div>
        </div>
        
        <div ref={setupRef} className={`${styles.testimonial} reveal`}>
          <p>"Our dream wedding would not be possible without the hardwork and patience that Jayfill's team given to us. From the bottom of our hearts, thank you guys! You never let us down since day 1, from prenup up to the wedding day. The service you've given us is beyond our expectations. Alam nyo na ha? Sa maternity shoot ko, our baby's christening and birthdays, kayo ulit please! ♥️♥️♥️ Pa-family portrait nadin haha"</p>
          <div className={styles.who}>Camille Zerna</div>
        </div>
      </div>
    </div>
  );
}
