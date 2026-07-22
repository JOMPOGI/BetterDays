import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import styles from './Navbar.module.css';

export function Navbar() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: document.querySelector('.snap-container'),
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    const sections = document.querySelectorAll('.snap-section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`${styles.navbar} ${activeSection === 'home' ? styles.homeActive : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>BETTER DAYS STUDIOS</span>
        </div>
        
        <nav className={styles.navLinks}>
          <button 
            className={`${styles.navLink} ${activeSection === 'home' ? styles.active : ''}`}
            onClick={() => scrollToSection('home')}
          >
            HOME
          </button>
          <button 
            className={`${styles.navLink} ${activeSection === 'services' ? styles.active : ''}`}
            onClick={() => scrollToSection('services')}
          >
            SERVICES
          </button>
          <button 
            className={`${styles.navLink} ${activeSection === 'testimonials' ? styles.active : ''}`}
            onClick={() => scrollToSection('testimonials')}
          >
            TESTIMONIALS
          </button>
          <button 
            className={`${styles.navLink} ${activeSection === 'inquire' ? styles.active : ''}`}
            onClick={() => scrollToSection('inquire')}
          >
            INQUIRE
          </button>
        </nav>

        <div className={styles.rightAction}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
