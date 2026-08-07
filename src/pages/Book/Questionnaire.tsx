import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import styles from './BookingWizard.module.css';

export function Questionnaire({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const { state } = useBooking();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    style: string;
    mood: string[];
    inspiration: string;
    mustNotMiss: string[];
    story: string;
    finalNotes: string;
  }>({
    style: '',
    mood: [],
    inspiration: '',
    mustNotMiss: [],
    story: '',
    finalNotes: ''
  });

  if (!state.paymentReference) {
    return (
      <div className={styles.wizardContainer} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className={styles.stepContent}>
          <h2>Unauthorized</h2>
          <p>You must complete your reservation payment before accessing the Creative Vision Questionnaire.</p>
          <button className={styles.actionBtn} onClick={() => onBack ? onBack() : navigate('/')}>Return to Booking</button>
        </div>
      </div>
    );
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save this to the MockDataContext / Project record here.
    alert('Thank you! Your Creative Vision Questionnaire has been submitted and attached to your project.');
    navigate('/');
  };

  return (
    <div className={styles.wizardContainer}>

      <main className={styles.main}>
        <div className={styles.stepContent}>
          
          {step === 1 && (
            <div>
              <h2>Film Style & Mood</h2>
              <form className={styles.form}>
                <label>Overall Style</label>
                <select className={styles.input} onChange={e => setFormData({ ...formData, style: e.target.value })}>
                  <option value="">Select a style...</option>
                  <option value="Candid / Chill">Candid / Chill</option>
                  <option value="Cinematic / Epic">Cinematic / Epic</option>
                  <option value="Dramatic / Tearjerker">Dramatic / Tearjerker</option>
                  <option value="Feel Good / Fun">Feel Good / Fun</option>
                  <option value="Eccentric / Different">Eccentric / Different</option>
                </select>
                <label>Inspiration (Links to YouTube, Vimeo, GDrive, etc.)</label>
                <textarea 
                  placeholder="Paste links and tell us what you like about them..." 
                  onChange={e => setFormData({ ...formData, inspiration: e.target.value })}
                />
              </form>
              <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={nextStep} style={{ marginLeft: 'auto' }}>Next</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2>Must Not Miss Moments</h2>
              <p>Check the moments you absolutely want us to capture.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                {['Walking down the aisle', "Bride's first look", "Groom's first look", 'Parents', 'Grandparents', 'Family', 'Friends', 'Wedding vows', 'Ring exchange', 'First dance', 'Cake cutting', 'Speeches'].map(moment => (
                  <label key={moment} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" onChange={(e) => {
                      const newMoments = e.target.checked 
                        ? [...formData.mustNotMiss, moment]
                        : formData.mustNotMiss.filter(m => m !== moment);
                      setFormData({ ...formData, mustNotMiss: newMoments });
                    }} />
                    {moment}
                  </label>
                ))}
              </div>
              <div className={styles.actions}>
                <button className={styles.backBtn} onClick={prevStep}>Back</button>
                <button className={styles.actionBtn} onClick={nextStep}>Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2>Your Story</h2>
              <form className={styles.form}>
                <label>Tell us about the spark. How did you meet?</label>
                <textarea 
                  placeholder="When, where, what was it like..." 
                  onChange={e => setFormData({ ...formData, story: e.target.value })}
                />
                <label>What do you love about each other now?</label>
                <textarea placeholder="Why are you marrying this person?" />
              </form>
              <div className={styles.actions}>
                <button className={styles.backBtn} onClick={prevStep}>Back</button>
                <button className={styles.actionBtn} onClick={nextStep}>Next</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2>Final Notes</h2>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label>Anything else you'd like our team to know?</label>
                <textarea 
                  placeholder="Details, surprises, concerns..." 
                  onChange={e => setFormData({ ...formData, finalNotes: e.target.value })}
                />
                <div className={styles.actions}>
                  <button type="button" className={styles.backBtn} onClick={prevStep}>Back</button>
                  <button type="submit" className={styles.actionBtn}>Submit Questionnaire</button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
