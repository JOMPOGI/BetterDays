import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

interface NavbarProps {
  shrunk: boolean;
}

export function Navbar({ shrunk }: NavbarProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'work', 'testimonials', 'booking'];
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
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`${styles.nav} ${shrunk ? styles.shrunk : ''} ${shrunk ? styles.scrolled : ''}`}>
      <div className={styles.brandmark}>
        BETTER DAYS STUDIOS
      </div>
      <div className={styles.navlinks}>
        <button className={activeSection === 'home' ? styles.active : ''} onClick={() => scrollToSection('home')}>HOME</button>
        <button className={activeSection === 'about' ? styles.active : ''} onClick={() => scrollToSection('about')}>ABOUT</button>
        <button className={activeSection === 'services' ? styles.active : ''} onClick={() => scrollToSection('services')}>SERVICES</button>
        <button className={activeSection === 'work' ? styles.active : ''} onClick={() => scrollToSection('work')}>GALLERY</button>
        <button className={activeSection === 'testimonials' ? styles.active : ''} onClick={() => scrollToSection('testimonials')}>TESTIMONIALS</button>
      </div>
      <button 
        onClick={() => scrollToSection('booking')} 
        className={styles.navCta}
        style={{ opacity: shrunk ? 1 : 0, pointerEvents: shrunk ? 'auto' : 'none' }}
      >
        BOOK NOW
      </button>
    </nav>
  );
}
