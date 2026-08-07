import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './Hero.module.css';

export function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add riseIn animation classes on mount
    const timer1 = setTimeout(() => eyebrowRef.current?.classList.add(styles.in), 300);
    const timer2 = setTimeout(() => titleRef.current?.classList.add(styles.in), 550);
    const timer3 = setTimeout(() => subRef.current?.classList.add(styles.in), 800);
    const timer4 = setTimeout(() => bottomRef.current?.classList.add(styles.in), 1100);

    return () => {
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4);
    };
  }, []);

  return (
    <div className={styles.hero}>
      <div className={styles.videoContainer}>
        <div className={styles.overlay}></div>
        <img 
          src="/images/wedding.jpg"
          alt="Better Days Studios Wedding Background"
          className={styles.video} 
        />
      </div>
      <div className={styles.heroNoise}></div>
      
      {showVideo && createPortal(
        <div className={styles.videoModal} onClick={() => setShowVideo(false)}>
          <button className={styles.closeVideoBtn} onClick={() => setShowVideo(false)}>EXIT VIDEO</button>
          <div className={styles.videoWrapper} onClick={e => e.stopPropagation()} style={{ width: '100%', height: '100%', maxWidth: '1400px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <iframe 
              src="https://www.youtube.com/embed/TVDLro0YrXA?autoplay=1" 
              className={styles.fullScreenVideo}
              style={{ border: 'none', width: '100%', height: '100%', objectFit: 'contain' }}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>,
        document.body
      )}
      
      <div className={styles.heroContent}>
        <h1 ref={titleRef} className={styles.heroTitle}>
          Better Days <em>Studios</em>
        </h1>
        <p ref={subRef} className={styles.heroSub}>
          <span className={styles.tagline}>Captivating Moments • Manifesting Better Days</span>
        </p>
        <div ref={bottomRef} className={styles.heroActions}>
          <button 
             className={styles.heroCta} 
             onClick={() => {
               const el = document.getElementById('booking');
               if (el) el.scrollIntoView({ behavior: 'smooth' });
             }}
             style={{ margin: 0 }}
          >
            BOOK NOW
          </button>
          <button 
             className={styles.heroCtaAlt} 
             onClick={() => setShowVideo(true)}
          >
            WATCH FILMS
          </button>
        </div>
      </div>

    </div>
  );
}
