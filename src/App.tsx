import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LogoIntroAnimation } from './components/LogoIntroAnimation';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { InquirySection } from './components/InquirySection';
import { Footer } from './components/Footer';

function App() {
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    if (!introFinished) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'hidden'; // Let the .snap-container handle scrolling
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [introFinished]);

  return (
    <>
      {!introFinished && <LogoIntroAnimation onComplete={() => setIntroFinished(true)} />}
      <Navbar />
      
      <main 
        className="snap-container"
        style={{ opacity: introFinished ? 1 : 0, transition: 'opacity 1s ease' }}
      >
        <section id="home" className="snap-section">
          <Hero onInquireClick={() => document.getElementById('inquire')?.scrollIntoView({ behavior: 'smooth' })} />
        </section>

        <section id="services" className="snap-section">
          <Services />
        </section>

        <section id="testimonials" className="snap-section">
          <Testimonials />
        </section>

        <section id="inquire" className="snap-section">
          <InquirySection />
        </section>

        <section id="footer" className="snap-section" style={{ height: 'auto', minHeight: '50vh', display: 'flex', alignItems: 'flex-end' }}>
          <Footer />
        </section>
      </main>
    </>
  );
}

export default App;
