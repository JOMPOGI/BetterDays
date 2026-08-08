import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/app/providers/BookingContext';
import { Check, UploadCloud, Download } from 'lucide-react';
import { downloadElementAsPDF } from '@/utils/pdfExport';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import styles from '../booking/BookingWizard.module.css';

export function Questionnaire({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const { state } = useBooking();
  
  // step 0 is "Payment Confirmed", step 1 is "Creative Brief"
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState<{
    style: string[];
    customStyle: string;
    mustHaveShots: string[];
    customShot: string;
    inspiration: string;
    story: string;
    duration: string;
    spark: string;
    likedThen: string;
    activities: string;
    unforgettable: string;
    sentimental: string;
    dislikes: string;
    engagement: string;
    loveNow: string;
  }>({
    style: [],
    customStyle: '',
    mustHaveShots: [],
    customShot: '',
    inspiration: '',
    story: '',
    duration: '',
    spark: '',
    likedThen: '',
    activities: '',
    unforgettable: '',
    sentimental: '',
    dislikes: '',
    engagement: '',
    loveNow: ''
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
    if (formData.style.length === 0) {
      addToast('Please select at least one video style.', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Your Creative Vision Questionnaire has been submitted!', 'success');
      navigate('/');
    }, 1200);
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
  <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--book-muted)' }}>
    Question {currentQIndex + 1} of 13
  </div>

  { [
    <div className={styles.qSection}>
                  <h3>Video Style <span>select all that apply</span></h3>
                  <div className={styles.pillGrid}>
                    {['Candid / Chill', 'Cinematic / Epic', 'Dramatic / Tearjerker', 'Feel Good / Fun', 'Eccentric / Different', 'FUN', 'SILLY', 'HEARTWARMING', 'MEANINGFUL', 'INCLUSIVE', 'MOMENTOUS', 'CAPTURES THE SENTIMENTAL MOMENTS'].map(style => (
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

                ,
    <div className={styles.qSection}>
                  <h3>Must-Have Shots <span>optional</span></h3>
                  <div className={styles.pillGrid}>
                    {['Walking down the aisle', 'Look of the groom', 'Look of the bride', 'Vows', 'Silly and fun moments'].map(shot => (
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

                ,
    <div className={styles.qSection}>
                  <h3>Visual Inspiration <span>optional</span></h3>
                  <textarea 
                    className={styles.textarea}
                    placeholder="Share links, directors, photographers, or films whose work you love..."
                    value={formData.inspiration}
                    onChange={e => setFormData({ ...formData, inspiration: e.target.value })}
                  />
                </div>

                ,
    <div className={styles.qSection}>
                  <h3>Inspiration Photos <span>optional</span></h3>
                  <div className={styles.uploadBox}>
                    <UploadCloud size={32} className={styles.uploadBoxIcon} />
                    <p>Drop files here or <span>browse</span></p>
                    <small>PNG, JPG up to 10MB each</small>
                  </div>
                </div>

                ,
    <div className={styles.qSection}>
                  <h3>How long have you been together?</h3>
                  <input 
                    type="text" 
                    className={styles.input} 
                    style={{ background: 'transparent', width: '100%' }}
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>

                ,
    <div className={styles.qSection}>
                  <h3>Tell us about the spark. (If there was any!)</h3>
                  <p className={styles.stepDesc}>How did you meet? When? Where? What was it like?</p>
                  <textarea 
                    className={styles.textarea}
                    value={formData.spark}
                    onChange={e => setFormData({ ...formData, spark: e.target.value })}
                  />
                </div>

                ,
    <div className={styles.qSection}>
                  <h3>What did you like about each other then?</h3>
                  <textarea 
                    className={styles.textarea}
                    value={formData.likedThen}
                    onChange={e => setFormData({ ...formData, likedThen: e.target.value })}
                  />
                </div>

                ,
    <div className={styles.qSection}>
                  <h3>What do you enjoy doing together?</h3>
                  <p className={styles.stepDesc}>What is a usual date for you?</p>
                  <textarea 
                    className={styles.textarea}
                    value={formData.activities}
                    onChange={e => setFormData({ ...formData, activities: e.target.value })}
                  />
                </div>

                ,
    <div className={styles.qSection}>
                  <h3>Any unforgettable moments you'd like to share?</h3>
                  <textarea 
                    className={styles.textarea}
                    value={formData.unforgettable}
                    onChange={e => setFormData({ ...formData, unforgettable: e.target.value })}
                  />
                </div>

                ,
    <div className={styles.qSection}>
                  <h3>Any sentimental items or things during the course of your relationship?</h3>
                  <textarea 
                    className={styles.textarea}
                    value={formData.sentimental}
                    onChange={e => setFormData({ ...formData, sentimental: e.target.value })}
                  />
                </div>

                ,
    <div className={styles.qSection}>
                  <h3>What do you hate or dislike about each other?</h3>
                  <textarea 
                    className={styles.textarea}
                    value={formData.dislikes}
                    onChange={e => setFormData({ ...formData, dislikes: e.target.value })}
                  />
                </div>

                ,
    <div className={styles.qSection}>
                  <h3>Tell us about your engagement.</h3>
                  <textarea 
                    className={styles.textarea}
                    value={formData.engagement}
                    onChange={e => setFormData({ ...formData, engagement: e.target.value })}
                  />
                </div>

                ,
    <div className={styles.qSection}>
                  <h3>What do you love about each other now?</h3>
                  <p className={styles.stepDesc}>Basically, why are you marrying this person?</p>
                  <textarea 
                    className={styles.textarea}
                    value={formData.loveNow}
                    onChange={e => setFormData({ ...formData, loveNow: e.target.value })}
                  />
                </div>

                
  ][currentQIndex] }

  <div className={styles.actions} style={{ marginTop: '40px', display: 'flex', gap: '12px' }}>
    {currentQIndex > 0 ? (
      <button 
        type="button"
        className={styles.backBtn} 
        style={{ flex: 1 }}
        onClick={() => setCurrentQIndex(i => i - 1)}
      >
        &larr; Previous
      </button>
    ) : (
      <button 
        type="button"
        className={styles.backBtn} 
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
        onClick={() => downloadElementAsPDF('creative-brief', 'BetterDays-Brief')}
      >
        <Download size={16} /> Save Brief as PDF
      </button>
    )}

    {currentQIndex < 12 ? (
      <button 
        type="button"
        className={styles.actionBtn} 
        style={{ flex: 1 }}
        onClick={() => setCurrentQIndex(i => i + 1)}
      >
        Next &rarr;
      </button>
    ) : (
      <button type="submit" className={styles.actionBtn} style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }} disabled={loading}>
        {loading ? <><Spinner size={16} color="var(--book-bg)" /> Submitting...</> : 'Submit Brief →'}
      </button>
    )}
  </div>
</form>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
