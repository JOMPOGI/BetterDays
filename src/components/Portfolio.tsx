import React, { useState } from 'react';
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

  return (
    <div style={{ padding: 'min(14vh,140px) 6vw' }}>
      {activeVideo && (
        <div className={styles.videoModal} onClick={() => setActiveVideo(null)}>
          <button className={styles.closeBtn} onClick={() => setActiveVideo(null)}>EXIT VIDEO</button>
          <div className={styles.videoWrapper} onClick={e => e.stopPropagation()}>
            <video src={activeVideo} autoPlay controls playsInline className={styles.fullVideo} />
          </div>
        </div>
      )}

      <div ref={setupRef} className="eyebrow reveal">Selected Reels</div>
      <h2 ref={setupRef} className="reveal">A frame from <em>every</em> better day.</h2>
      
      <div className={styles.reelStrip}>
        <div ref={setupRef} className={`${styles.frameCard} reveal`} onClick={() => setActiveVideo('/wed2.mp4')}>
          <video src="/wed2.mp4" autoPlay loop muted playsInline className={styles.fillVideo} />
          <div className={styles.frameTop}><span>WEDDING FILM</span></div>
          <div className={styles.playIcon}><svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M0 0L14 8L0 16V0Z" fill="#E8E1D0"/></svg></div>
          <div className={styles.frameMeta}>
            <div className={styles.fmCouple}>The Wedding of Vestiah and AC 🍃</div>
            <div className={styles.fmDesc}>
              𝘈𝘊 𝘯𝘦𝘷𝘦𝘳 𝘨𝘢𝘷𝘦 𝘶𝘱 𝘰𝘯 𝘤𝘩𝘢𝘴𝘪𝘯𝘨 𝘵𝘩𝘦 𝘭𝘰𝘷𝘦 𝘩𝘦 𝘬𝘯𝘦𝘸 𝘸𝘢𝘴 𝘮𝘦𝘢𝘯𝘵 𝘵𝘰 𝘣𝘦. 𝘈𝘧𝘵𝘦𝘳 𝘢𝘭𝘭 𝘵𝘩𝘦 𝘵𝘪𝘮𝘦, 𝘦𝘧𝘧𝘰𝘳𝘵, 𝘢𝘯𝘥 𝘱𝘢𝘵𝘪𝘦𝘯𝘤𝘦, 𝘵𝘰𝘥𝘢𝘺 𝘪𝘴 𝘵𝘩𝘦 𝘥𝘢𝘺 𝘪𝘵 𝘢𝘭𝘭 𝘤𝘰𝘮𝘦𝘴 𝘵𝘰𝘨𝘦𝘵𝘩𝘦𝘳. 𝘙𝘪𝘨𝘩𝘵 𝘵𝘪𝘮𝘦, 𝘳𝘪𝘨𝘩𝘵 𝘱𝘭𝘢𝘤𝘦, 𝘢𝘯𝘥 𝘵𝘩𝘦 𝘱𝘦𝘳𝘧𝘦𝘤𝘵 𝘱𝘦𝘳𝘴𝘰𝘯 𝘣𝘺 𝘩𝘪𝘴 𝘴𝘪𝘥𝘦. 𝘏𝘦𝘳𝘦'𝘴 𝘵𝘰 𝘵𝘩𝘦 𝘴𝘵𝘢𝘳𝘵 𝘰𝘧 𝘧𝘰𝘳𝘦𝘷𝘦𝘳 𝘸𝘪𝘵𝘩 𝘝𝘦𝘴𝘵𝘪𝘢𝘩.<br/><br/>
              • Photo: The Backyard Studios<br/>
              • Video: Better Days Studios<br/>
              • Coord: EventTree Wedding & Event Management<br/>
              • HMUA: Annika Dayrit Makeup<br/>
              <span className={styles.fmTags}>#betterdays #manifestingbetterdays #betterdaysstudios #wedding #weddingvideography #destinationwedding #CaptivatingMoments</span>
            </div>
          </div>
        </div>

        <div ref={setupRef} className={`${styles.frameCard} reveal`} onClick={() => setActiveVideo('/wed1.mp4')}>
          <video src="/wed1.mp4" autoPlay loop muted playsInline className={styles.fillVideo} />
          <div className={styles.frameTop}><span>WEDDING FILM</span></div>
          <div className={styles.playIcon}><svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M0 0L14 8L0 16V0Z" fill="#E8E1D0"/></svg></div>
          <div className={styles.frameMeta}>
            <div className={styles.fmCouple}>Dio and Erika / A minute of love</div>
            <div className={styles.fmDesc}>
              ~ 𝘩𝘦𝘳𝘦, 𝘮𝘢𝘬𝘪𝘯𝘨 𝘦𝘢𝘤𝘩 𝘥𝘢𝘺 𝘰𝘧 𝘵𝘩𝘦 𝘺𝘦𝘢𝘳 🍃<br/><br/>
              Photo: Pat Dy Photography<br/>
              Video: Better Days Studios
            </div>
          </div>
        </div>

        <div ref={setupRef} className={`${styles.frameCard} reveal`} onClick={() => setActiveVideo('/wed 3.mp4')}>
          <video src="/wed 3.mp4" autoPlay loop muted playsInline className={styles.fillVideo} />
          <div className={styles.frameTop}><span>WEDDING FILM</span></div>
          <div className={styles.playIcon}><svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M0 0L14 8L0 16V0Z" fill="#E8E1D0"/></svg></div>
          <div className={styles.frameMeta}>
            <div className={styles.fmCouple}>Dianne & Jan Michael | Wedding Film 🌿</div>
            <div className={styles.fmDesc}>
              • Ikigai Studio by Myio • Better Days Studios • One Twenty - Three Weddings & Events • Caren Garcia Makeup • Gary Dacanay Event Styling •<br/>
              ~<br/>
              <span className={styles.fmTags}>#betterdays #manifestingbetterdays #betterdaysstudios #wedding #weddingvideography</span>
            </div>
          </div>
        </div>

        <div ref={setupRef} className={`${styles.frameCard} reveal`} onClick={() => setActiveVideo('/pre-wed.mp4')}>
          <video src="/pre-wed.mp4" autoPlay loop muted playsInline className={styles.fillVideo} />
          <div className={styles.frameTop}><span>PRENUP FILM</span></div>
          <div className={styles.playIcon}><svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M0 0L14 8L0 16V0Z" fill="#E8E1D0"/></svg></div>
          <div className={styles.frameMeta}>
            <div className={styles.fmCouple}>The Pre Wedding of Jv & Dei 🍃</div>
            <div className={styles.fmDesc}>
              𝘑𝘝 𝘢𝘯𝘥 𝘋𝘦𝘪 𝘥𝘪𝘥𝘯'𝘵 𝘸𝘢𝘯𝘵 𝘢 𝘴𝘤𝘳𝘪𝘱𝘵𝘦𝘥 𝘱𝘳𝘦𝘯𝘶𝘱. 𝘕𝘰 𝘩𝘦𝘢𝘷𝘺 𝘥𝘪𝘳𝘦𝘤𝘵𝘪𝘯𝘨, 𝘯𝘰 𝘱𝘦𝘳𝘧𝘦𝘤𝘵 𝘱𝘰𝘴𝘦𝘴—𝘫𝘶𝘴𝘵 𝘵𝘩𝘦𝘮 𝘣𝘦𝘪𝘯𝘨 𝘵𝘩𝘦𝘮. 𝘞𝘢𝘭𝘬𝘪𝘯𝘨 𝘢𝘳𝘰𝘶𝘯𝘥 𝘚𝘪𝘯𝘨𝘢𝘱𝘰𝘳𝘦, 𝘭𝘢𝘶𝘨𝘩𝘪𝘯𝘨, 𝘦𝘹𝘱𝘭𝘰𝘳𝘪𝘯𝘨, 𝘢𝘯𝘥 𝘦𝘯𝘫𝘰𝘺𝘪𝘯𝘨 𝘵𝘩𝘦 𝘮𝘰𝘮𝘦𝘯𝘵 𝘵𝘰𝘨𝘦𝘵𝘩𝘦𝘳. 𝘍𝘶𝘯𝘯𝘺 𝘵𝘩𝘪𝘯𝘨 𝘪𝘴, 𝘸𝘦 𝘵𝘩𝘰𝘶𝘨𝘩𝘵 𝘸𝘦'𝘥 𝘣𝘦 𝘵𝘩𝘦 𝘰𝘯𝘦𝘴 𝘵𝘰𝘶𝘳𝘪𝘯𝘨 𝘵𝘩𝘦𝘮 𝘢𝘳𝘰𝘶𝘯𝘥... 𝘣𝘶𝘵 𝘵𝘩𝘦𝘺 𝘦𝘯𝘥𝘦𝘥 𝘶𝘱 𝘣𝘦𝘪𝘯𝘨 𝘰𝘶𝘳 𝘵𝘰𝘶𝘳 𝘨𝘶𝘪𝘥𝘦𝘴 𝘪𝘯𝘴𝘵𝘦𝘢𝘥. 𝘔𝘢𝘺𝘣𝘦 𝘵𝘩𝘢𝘵'𝘴 𝘵𝘩𝘦 𝘣𝘦𝘢𝘶𝘵𝘺 𝘰𝘧 𝘪𝘵—𝘵𝘩𝘪𝘴 𝘤𝘪𝘵𝘺 𝘪𝘴𝘯'𝘵 𝘫𝘶𝘴𝘵 𝘢 𝘱𝘭𝘢𝘤𝘦 𝘵𝘩𝘦𝘺 𝘷𝘪𝘴𝘪𝘵𝘦𝘥, 𝘪𝘵'𝘴 𝘢 𝘱𝘭𝘢𝘤𝘦 𝘵𝘩𝘢𝘵 𝘸𝘪𝘭𝘭 𝘢𝘭𝘸𝘢𝘺𝘴 𝘣𝘦 𝘱𝘢𝘳𝘵 𝘰𝘧 𝘵𝘩𝘦𝘪𝘳 𝘴𝘵𝘰𝘳𝘺. 🇸🇬<br/><br/>
              <span className={styles.fmTags}>#betterdays #manifestingbetterdays #betterdaysstudios #wedding #weddingvideography #destinationwedding #CaptivatingMoments</span>
            </div>
          </div>
        </div>

        <div ref={setupRef} className={`${styles.frameCard} reveal`} onClick={() => setActiveVideo('/pre-wed2.mp4')}>
          <video src="/pre-wed2.mp4" autoPlay loop muted playsInline className={styles.fillVideo} />
          <div className={styles.frameTop}><span>PRENUP FILM</span></div>
          <div className={styles.playIcon}><svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M0 0L14 8L0 16V0Z" fill="#E8E1D0"/></svg></div>
          <div className={styles.frameMeta}>
            <div className={styles.fmCouple}>Chester & Cath | Pre-Wedding Film 🍃</div>
            <div className={styles.fmDesc}>
              𝘢𝘬𝘬𝘢𝘸 𝘣𝘢𝘭𝘦𝘳<br/><br/>
              • Photo/ Renzo Santos Photography<br/>
              • Video/ Better Days Studios<br/>
              <span className={styles.fmTags}>#betterdays #manifestingbetterdays #betterdaysstudios #wedding #weddingvideography #destinationwedding</span>
            </div>
          </div>
        </div>

        <div ref={setupRef} className={`${styles.frameCard} reveal`} onClick={() => setActiveVideo('/pre-wed 3.mp4')}>
          <video src="/pre-wed 3.mp4" autoPlay loop muted playsInline className={styles.fillVideo} />
          <div className={styles.frameTop}><span>PRENUP FILM</span></div>
          <div className={styles.playIcon}><svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M0 0L14 8L0 16V0Z" fill="#E8E1D0"/></svg></div>
          <div className={styles.frameMeta}>
            <div className={styles.fmCouple}>Mano & Red | Pre-Wedding Film 🍃</div>
            <div className={styles.fmDesc}>
              • Photo/ Arvin Simbulan Photography<br/>
              • Video/ Better Days Studios<br/>
              <span className={styles.fmTags}>#betterdays #manifestingbetterdays #betterdaysstudios #wedding #weddingvideography #destinationwedding</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
