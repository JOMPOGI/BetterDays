import { Mail, Phone } from 'lucide-react';
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
            <a href="mailto:studiosbetterdays@gmail.com" className={styles.contactLink}>
              <Mail size={16} />
              <span>studiosbetterdays@gmail.com</span>
            </a>
            <a href="tel:09278519773" className={styles.contactLink}>
              <Phone size={16} />
              <span>0927 851 9773</span>
            </a>
          </div>
          
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram">
              IG
            </a>
          </div>
        </div>
        
        <div className={styles.mapContainer}>
          {/* Simple embedded map iframe for the studio location. 
              Replace src with actual Google Maps embed URL when available */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.800041490926!2d121.05061617510526!3d14.553416085927503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8f2ba1261f9%3A0xc3f8e5d36e2f0a1c!2sBonifacio%20Global%20City%2C%20Taguig%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Studio Location"
          ></iframe>
        </div>
      </div>
    </footer>
  );
}
