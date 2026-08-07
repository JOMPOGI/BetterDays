import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      
      {showVideo && (
        <div className={styles.videoModal}>
          <button className={styles.closeVideoBtn} onClick={() => setShowVideo(false)}>EXIT VIDEO</button>
          <video 
            autoPlay 
            controls
            className={styles.fullScreenVideo}
          >
            <source src="/pre-wed.mp4" type="video/mp4" />
          </video>
        </div>
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
