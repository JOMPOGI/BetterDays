import React from 'react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footMain}>
        <div className={styles.footBrand}>Better Days Studios</div>
        <div style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Captivating Moments • Manifesting Better Days</div>
        <p style={{ marginTop: '20px', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.6 }}>
          We create timeless wedding and prenup films that preserve your most meaningful moments.
        </p>
        <div style={{ marginTop: '40px', color: 'var(--text-muted)' }}>© 2026 Better Days Studios. All rights reserved.</div>
      </div>
      
      <div className={styles.footCols}>
        <div className={styles.footCol}>
          <span className={styles.footHead}>Quick Links</span>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#work">Gallery</a>
          <a href="#testimonials">Testimonials</a>
        </div>
        
        <div className={styles.footCol}>
          <span className={styles.footHead}>Contact</span>
          <a href="https://instagram.com/betterdaysstudios" target="_blank" rel="noreferrer"><strong>Instagram:</strong> @betterdaysstudios</a>
          <a href="tel:09278519773"><strong>Phone:</strong> 0927 851 9773</a>
          <a href="mailto:studiosbetterdays@gmail.com"><strong>Email:</strong> studiosbetterdays@gmail.com</a>
          <a href="#"><strong>Messenger:</strong> Better Days Studios</a>
        </div>
      </div>
    </footer>
  );
}
