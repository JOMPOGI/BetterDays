import { useState, useEffect } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navbar } from '@/components/navigation/Navbar';
import { LogoIntroAnimation } from '@/components/shared/LogoIntroAnimation';
import { Hero } from '@/components/hero/Hero';
import { Services } from '@/components/section/Services';
import { Testimonials } from '@/components/section/Testimonials';
import { Footer } from '@/components/footer/Footer';
import { Philosophy } from '@/components/section/Philosophy';
import { Portfolio } from '@/components/section/Portfolio';
import { Process } from '@/components/section/Process';
import { BookingWizard } from '@/features/booking/BookingWizard';

function PublicSite() {
  const [introFinished, setIntroFinished] = useState(false);
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    document.body.classList.remove('admin-mode');
    if (!introFinished) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; 
    }
    
    const handleScroll = () => {
      const y = window.scrollY;
      setShrunk(y > 80);
    };

    if (introFinished) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('scroll', handleScroll);
    };
  }, [introFinished]);

  return (
    <>
      {!introFinished && <LogoIntroAnimation onComplete={() => setIntroFinished(true)} />}
      <div className="grain"></div>
      <Navbar shrunk={shrunk} />
      
      <main style={{ opacity: introFinished ? 1 : 0, transition: 'opacity 1s ease' }}>
        <section id="home" style={{ padding: 0 }}>
          <Hero />
        </section>
        <section id="about" style={{ padding: 0 }}>
          <Philosophy />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="work">
          <Portfolio />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="process">
          <Process />
        </section>
        <section id="booking" style={{ padding: 0, height: '100dvh' }}>
          <BookingWizard />
        </section>
        <Footer />
      </main>
    </>
  );
}

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicSite />
  }
];
