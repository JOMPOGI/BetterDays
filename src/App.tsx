import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { BookingWizard } from './pages/Book/BookingWizard';
import { Login } from './pages/Admin/Login';
import { AdminLayout } from './pages/Admin/Layout';
import { Inquiries } from './pages/Admin/Inquiries';

import { Calendar } from './pages/Admin/Calendar';
import { Clients } from './pages/Admin/Clients';

import { ProtectedRoute } from './components/Admin/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { LogoIntroAnimation } from './components/LogoIntroAnimation';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { InquirySection } from './components/InquirySection';
import { Footer } from './components/Footer';

import { Philosophy } from './components/Philosophy';
import { Portfolio } from './components/Portfolio';
import { Process } from './components/Process';

function PublicSite() {
  const [introFinished, setIntroFinished] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [scene, setScene] = useState('SCENE 01');

  useEffect(() => {
    // Remove admin mode class if present
    document.body.classList.remove('admin-mode');

    if (!introFinished) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; 
    }
    
    const handleScroll = () => {
      const y = window.scrollY;
      setShrunk(y > 80);

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? Math.min(y / docH, 1) : 0;
      
      const totalFrames = Math.floor(pct * 60 * 60 * 24);
      const ff = totalFrames % 24;
      const totalSec = Math.floor(totalFrames / 24);
      const ss = totalSec % 60;
      const mm = Math.floor(totalSec / 60) % 60;
      const hh = Math.floor(totalSec / 3600);
      const pad = (n: number) => String(n).padStart(2,'0');
      setTimecode(`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`);

      const scenes = ['SCENE 01','SCENE 02','SCENE 03','SCENE 04','SCENE 05','SCENE 06'];
      const sceneIdx = Math.min(Math.floor(pct * scenes.length), scenes.length - 1);
      setScene(scenes[sceneIdx]);
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

        <section id="process">
          <Process />
        </section>

        <section id="testimonials">
          <Testimonials />
        </section>

        <section id="booking" style={{ padding: 0 }}>
          {/* <BookingWizard /> */}
        </section>

        <Footer />
      </main>
    </>
  );
}

function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/schedule" replace />} />
              <Route path="/admin/schedule" element={<Calendar />} />
              <Route path="/admin/inquiries" element={<Inquiries />} />
              <Route path="/admin/clients" element={<Clients />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  );
}

export default App;
