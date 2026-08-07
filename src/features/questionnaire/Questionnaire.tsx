import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/app/providers/BookingContext';
import { Check, UploadCloud, Download } from 'lucide-react';
import { downloadElementAsPDF } from '@/utils/pdfExport';
import styles from './BookingWizard.module.css';

export function Questionnaire({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const { state } = useBooking();
  
  // step 0 is "Payment Confirmed", step 1 is "Creative Brief"
  const [step, setStep] = useState(0); 
  
  const [formData, setFormData] = useState<{
    style: string[];
    customStyle: string;
    mustHaveShots: string[];
    customShot: string;
    inspiration: string;
    story: string;
  }>({
    style: [],
    customStyle: '',
    mustHaveShots: [],
    customShot: '',
    inspiration: '',
    story: ''
  });

  const toggleStyle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      style: prev.style.includes(style) 
        ? prev.style.filter(s => s !== style)
        : [...prev.style, style]
    }));
  };

  const toggleShot = (shot: string) => {
    setFormData(prev => ({
      ...prev,
      mustHaveShots: prev.mustHaveShots.includes(shot) 
        ? prev.mustHaveShots.filter(s => s !== shot)
        : [...prev.mustHaveShots, shot]
    }));
  };

  if (!state.paymentReference) {
    return (
      <div className={styles.wizardContainer} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className={styles.stepContent} style={{ textAlign: 'center' }}>
          <h2>Unauthorized</h2>
          <p style={{ color: 'var(--book-muted)' }}>You must complete your reservation payment before accessing this section.</p>
          <button className={styles.actionBtn} onClick={() => onBack ? onBack() : navigate('/')} style={{ margin: '24px auto' }}>Return to Booking</button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! Your Creative Vision Questionnaire has been submitted and attached to your project.');
    navigate('/');
  };

  const getPackageName = () => {
    switch (state.selectedPackage) {
      case 'wedding': return 'Wedding Film';
      case 'prenup': return 'Prenup Film';
      case 'wedding_prenup': return 'Wedding + Prenup';
      default: return 'Package';
    }
  };

  return (
    <div className={styles.wizardContainer}>
      <main className={styles.main}>
        <div className={styles.wizardContent} style={{ maxWidth: step === 0 ? '500px' : '700px' }}>
          
          {step === 0 && (
            <div className={styles.stepContent} id="payment-receipt" style={{ padding: '20px', margin: '-20px' }}>
              <div className={styles.successCheckCircle}>
                <Check size={32} />
              </div>
              
              <div className={styles.successHeader}>
                <h2>Payment Confirmed</h2>
                <p>Your downpayment has been received successfully.</p>
              </div>

              <div className={styles.referenceCard}>
                <span>Booking Reference</span>
                <h3>{state.paymentReference || 'BDS-MSJ8ZEDT-JRH4'}</h3>
                <p>Keep this reference for your records</p>
              </div>

              <div className={styles.lightSummary} style={{ padding: '32px' }}>
                <div className={styles.summaryRow}>
                  <span>Couple</span>
                  <span>{state.clientDetails.firstName} &amp; {state.clientDetails.lastName}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Package</span>
                  <span>{getPackageName()}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Email</span>
                  <span>{state.clientDetails.email}</span>
                </div>
                <div className={styles.summaryRow} style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--book-border)' }}>
                  <span>Payment Status</span>
                  <span><span className={styles.statusDot}></span>Downpayment Received</span>
                </div>
              </div>

              <div className={styles.nextStepsBox}>
                <p>Almost done! Complete our Creative Questionnaire so we can start crafting your vision before the big day.</p>
              </div>

              <div className={styles.actions} style={{ justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  className={styles.backBtn} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0' }} 
                  onClick={() => downloadElementAsPDF('payment-receipt', 'BetterDays-Receipt')}
                >
                  <Download size={16} /> Download Receipt
                </button>
                <button className={styles.actionBtn} onClick={() => setStep(1)} style={{ margin: '0' }}>
                  Begin Creative Brief &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className={styles.stepContent} id="creative-brief" style={{ padding: '20px', margin: '-20px' }}>
              <h2>Your Creative Brief</h2>
              <p className={styles.stepDesc}>Help us craft a film that is unmistakably yours.</p>
              
              <form onSubmit={handleSubmit}>
                
                <div className={styles.qSection}>
                  <h3>Video Style <span>select all that apply</span></h3>
                  <div className={styles.pillGrid}>
                    {['Cinematic Drama', 'Intimate Documentary', 'Golden-Hour Romance', 'Moody Editorial', 'Bright & Airy', 'Timeless Classic', 'Bohemian Free', 'Modern Minimalist'].map(style => (
                      <button 
                        type="button" 
                        key={style} 
                        className={`${styles.briefPill} ${formData.style.includes(style) ? styles.selected : ''}`}
                        onClick={() => toggleStyle(style)}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    className={styles.input} 
                    style={{ marginTop: '16px', background: 'transparent', width: '100%' }}
                    placeholder="Other style (optional)" 
                    value={formData.customStyle}
                    onChange={e => setFormData({ ...formData, customStyle: e.target.value })}
                  />
                </div>

                <div className={styles.qSection}>
                  <h3>Must-Have Shots <span>optional</span></h3>
                  <div className={styles.pillGrid}>
                    {['First look', 'Ring exchange', 'First kiss', 'First dance', 'Parent dances', 'Bouquet toss', 'Sparkler exit', 'Aerial drone', 'Candid guest moments', 'Vows & speeches'].map(shot => (
                      <button 
                        type="button" 
                        key={shot} 
                        className={`${styles.briefPill} ${formData.mustHaveShots.includes(shot) ? styles.selected : ''}`}
                        onClick={() => toggleShot(shot)}
                      >
                        {shot}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    className={styles.input} 
                    style={{ marginTop: '16px', background: 'transparent', width: '100%' }}
                    placeholder="Other must-have shots (optional)" 
                    value={formData.customShot}
                    onChange={e => setFormData({ ...formData, customShot: e.target.value })}
                  />
                </div>

                <div className={styles.qSection}>
                  <h3>Visual Inspiration <span>optional</span></h3>
                  <textarea 
                    className={styles.textarea}
                    placeholder="Share links, directors, photographers, or films whose work you love..."
                    value={formData.inspiration}
                    onChange={e => setFormData({ ...formData, inspiration: e.target.value })}
                  />
                </div>

                <div className={styles.qSection}>
                  <h3>Inspiration Photos <span>optional</span></h3>
                  <div className={styles.uploadBox}>
                    <UploadCloud size={32} className={styles.uploadBoxIcon} />
                    <p>Drop files here or <span>browse</span></p>
                    <small>PNG, JPG up to 10MB each</small>
                  </div>
                </div>

                <div className={styles.qSection}>
                  <h3>Your Love Story <span>*</span></h3>
                  <textarea 
                    className={styles.textarea}
                    placeholder="Tell us how you met, what makes your relationship unique, your favorite shared memory, and what you hope to feel when you watch your film..."
                    required
                    value={formData.story}
                    onChange={e => setFormData({ ...formData, story: e.target.value })}
                    style={{ minHeight: '160px' }}
                  />
                </div>

                <div className={styles.actions} style={{ marginTop: '40px', display: 'flex', gap: '12px' }}>
                  <button 
                    type="button"
                    className={styles.backBtn} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }} 
                    onClick={() => downloadElementAsPDF('creative-brief', 'BetterDays-Brief')}
                  >
                    <Download size={16} /> Save Brief as PDF
                  </button>
                  <button type="submit" className={styles.actionBtn} style={{ flex: 1 }}>
                    Submit Brief &rarr;
                  </button>
                </div>
                
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
