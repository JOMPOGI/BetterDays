import { useState, useEffect } from 'react';

import styles from './Navbar.module.css';

interface NavbarProps {
  shrunk: boolean;
}

export function Navbar({ shrunk }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'work', 'testimonials', 'process', 'booking'];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`${styles.nav} ${shrunk ? styles.shrunk : ''} ${shrunk ? styles.scrolled : ''} ${menuOpen ? styles.navOpen : ''}`}>
      <div className={styles.brandmark}>
        BETTER DAYS STUDIOS
      </div>
      
      <button 
        className={`${styles.hamburger} ${menuOpen ? styles.isOpen : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
      </button>

      <div className={`${styles.navlinks} ${menuOpen ? styles.menuOpen : ''}`}>
        <button className={activeSection === 'home' ? styles.active : ''} onClick={() => scrollToSection('home')}>HOME</button>
        <button className={activeSection === 'about' ? styles.active : ''} onClick={() => scrollToSection('about')}>ABOUT</button>
        <button className={activeSection === 'services' ? styles.active : ''} onClick={() => scrollToSection('services')}>SERVICES</button>
        <button className={activeSection === 'work' ? styles.active : ''} onClick={() => scrollToSection('work')}>GALLERY</button>
        <button className={activeSection === 'testimonials' ? styles.active : ''} onClick={() => scrollToSection('testimonials')}>TESTIMONIALS</button>
        <button className={activeSection === 'process' ? styles.active : ''} onClick={() => scrollToSection('process')}>HOW WE WORK</button>
        
        {/* Mobile only booking button inside menu */}
        <button 
          className={styles.mobileBookBtn} 
          onClick={() => scrollToSection('booking')}
        >
          BOOK NOW
        </button>
      </div>

      <button 
        onClick={() => scrollToSection('booking')} 
        className={`${styles.navCta} ${activeSection === 'booking' ? styles.activeCta : ''}`}
        style={{ opacity: shrunk && !menuOpen ? 1 : 0, pointerEvents: shrunk && !menuOpen ? 'auto' : 'none' }}
      >
        BOOK NOW
      </button>
    </nav>
  );
}
