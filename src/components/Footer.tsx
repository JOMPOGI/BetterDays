import { Mail, Phone, Camera, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.brand}>
            <h3>BETTER DAYS STUDIOS</h3>
            <p>Captivating Moments • Manifesting Better Days</p>
          </div>
          
          <div className={styles.contactDetails}>
            <a href="https://instagram.com/betterdaysstudios" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              <Camera size={16} />
              <span>@betterdaysstudios</span>
            </a>
            <a href="tel:09278519773" className={styles.contactLink}>
              <Phone size={16} />
              <span>0927 851 9773</span>
            </a>
            <a href="mailto:studiosbetterdays@gmail.com" className={styles.contactLink}>
              <Mail size={16} />
              <span>studiosbetterdays@gmail.com</span>
            </a>
            <a href="https://m.me/betterdaysstudios" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              <MessageCircle size={16} />
              <span>Better Days Studios</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
