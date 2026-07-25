import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import styles from './Navbar.module.css';

export function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false); // Close menu on click
  };

  return (
    <header className={`${styles.navbar} ${activeSection === 'home' ? styles.homeActive : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>BETTER DAYS STUDIOS</span>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
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
            GALLERY
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
