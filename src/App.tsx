import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Admin/Login';
import { AdminLayout } from './pages/Admin/Layout';
import { Inquiries } from './pages/Admin/Inquiries';

import { Calendar } from './pages/Admin/Calendar';
import { Clients } from './pages/Admin/Clients';
import { Home } from './pages/Admin/Home';
import { ProtectedRoute } from './components/Admin/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { LogoIntroAnimation } from './components/LogoIntroAnimation';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { InquirySection } from './components/InquirySection';
import { Footer } from './components/Footer';

function PublicSite() {
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
          <Hero 
            onInquireClick={() => document.getElementById('inquire')?.scrollIntoView({ behavior: 'smooth' })} 
            onGalleryClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </section>

        <section id="gallery" className="snap-section">
          <Gallery />
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Home />} />
            <Route path="/admin/calendar" element={<Calendar />} />
            <Route path="/admin/inquiries" element={<Inquiries />} />
            <Route path="/admin/clients" element={<Clients />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
