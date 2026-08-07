import { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Portfolio.module.css';

export function Portfolio() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

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

  const preWeddingVideos = [
    { id: 'cmiS1XYGzF0', title: 'Renzo & Anne' },
    { id: 'DxBhci1a3Wk', title: 'Macky & Gladys' },
    { id: 'Ie5qT9Qmngo', title: 'Dervin & Carmela' },
    { id: '4Ex9Yg37_tw', title: 'Kathleen & Glen' },
    { id: 'Lq9MHNEU56Q', title: 'Jermelyn & Jayr' },
    { id: 'ykpN51NMB1k', title: 'Calvin & Jed' },
  ];
  
  const weddingVideos = [
    { id: '2y3Upqo7Gf8', title: 'Romano & Red' },
    { id: 'M5RjjvKBZfg', title: 'Jc & Angelica' },
    { id: '1YN5Emi7Q6w', title: 'Kenneth & Rica' },
    { id: 'TVDLro0YrXA', title: 'Rika & Dio' },
    { id: 'dU6G48rcbB0', title: 'Renzo & Anne' },
    { id: '2cShehPE13s', title: 'Peter & Caren' },
  ];

  const renderCard = (v: {id: string, title: string}, type: string, index: number) => (
    <div key={`${v.id}-${index}`} className={styles.frameCard} onClick={() => setActiveVideo(v.id)}>
      <img src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`} alt={v.title} className={styles.fillVideo} />
      <div className={styles.frameTop}><span>{type}</span></div>
      <div className={styles.frameMeta}>
        <div className={styles.fmCouple}>{v.title}</div>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', padding: '0' }}>
      {activeVideo && createPortal(
        <div className={styles.videoModal} onClick={() => setActiveVideo(null)}>
          <button className={styles.closeBtn} onClick={() => setActiveVideo(null)}>EXIT VIDEO</button>
          <div className={styles.videoWrapper} onClick={e => e.stopPropagation()}>
            <iframe 
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} 
              className={styles.fullVideo}
              style={{ border: 'none', width: '100%', height: '100%' }}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>,
        document.body
      )}

      <div style={{ padding: '0 6vw', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div ref={setupRef} className="eyebrow reveal" style={{ margin: 0 }}>Click any frame to play</div>
          <a ref={setupRef} href="https://www.youtube.com/@betterdaysstudios10" target="_blank" rel="noreferrer" className="eyebrow reveal" style={{ margin: 0, textDecoration: 'none', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
            Subscribe on YouTube ↗
          </a>
        </div>
        <h2 ref={setupRef} className="reveal">A frame from <em>every</em> better day.</h2>
      </div>
      
      <div className={styles.marqueeWrapper}>
        <div className={`${styles.marqueeRow} ${styles.marqueeLeft}`}>
          {[...preWeddingVideos, ...preWeddingVideos].map((v, i) => renderCard(v, 'PRE-WEDDING FILM', i))}
        </div>
        <div className={`${styles.marqueeRow} ${styles.marqueeRight}`}>
          {[...weddingVideos, ...weddingVideos].map((v, i) => renderCard(v, 'WEDDING FILM', i))}
        </div>
      </div>
    </div>
  );
}
