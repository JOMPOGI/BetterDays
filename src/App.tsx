import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LogoIntroAnimation } from './components/LogoIntroAnimation';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { VisualShowcase } from './components/VisualShowcase';
import { Services } from './components/Services';
import { InquiryPanel } from './components/InquiryPanel';
import { Footer } from './components/Footer';

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    // If returning visitor, maybe skip intro? 
    // We handle this inside LogoIntroAnimation, but let's assume it finishes eventually.
    // To prevent scrolling during intro:
    if (!introFinished) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [introFinished]);

  const handleInquireClick = () => {
    setInquiryOpen(true);
  };

  return (
    <>
      {!introFinished && <LogoIntroAnimation onComplete={() => setIntroFinished(true)} />}
      
      <Navbar />
      
      <main style={{ opacity: introFinished ? 1 : 0, transition: 'opacity 1s ease' }}>
        <Hero onInquireClick={handleInquireClick} />
        <VisualShowcase />
        <Services />
        <Portfolio />
      </main>
      
      <Footer />
      
      <InquiryPanel isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}

export default App;
