import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { formatDateOnly } from '@/utils/date';
import styles from './InquirySection.module.css';

import { Step1Service, type Category } from '@/features/inquiries/flow/Step1Service';
import { Step2Date } from '@/features/inquiries/flow/Step2Date';
import { Step3Details } from '@/features/inquiries/flow/Step3Details';
import { Step4Success } from '@/features/inquiries/flow/Step4Success';

export function InquirySection() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [category, setCategory] = useState<Category>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
    social: '',
    location: '',
    notes: ''
  });

  const resetForm = () => {
    setStep(1);
    setCategory(null);
    setSelectedDate(null);
    setDetails({ name: '', email: '', phone: '', social: '', location: '', notes: '' });
    setErrorMsg('');
  };

  const submitInquiry = async (_turnstileToken: string) => {
    if (!selectedDate || !category) return;
    
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.rpc('submit_inquiry', {
        p_name: details.name,
        p_email: details.email,
        p_phone: details.phone,
        p_location: details.location,
        p_notes: details.notes,
        p_event_type: category,
        p_event_date: formatDateOnly(selectedDate),
        p_start_time: '09:00', // Default start time
        p_end_time: '18:00', // Default end time
      });

      if (error) {
        console.error('Supabase error:', error);
        setErrorMsg('An error occurred while submitting your inquiry. Please try again.');
        return;
      }

      setStep(4);
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      setErrorMsg('An error occurred while submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.ctaSection}>
      <div className="eyebrow reveal" style={{ justifyContent: 'center' }}>Start Your Reel</div>
      <h2 className="reveal" style={{ margin: '0 auto', maxWidth: '20ch', textAlign: 'center' }}>
        Let's manifest <em>your</em> better days.
      </h2>
      <p className="reveal" style={{ margin: '22px auto 44px', maxWidth: '44ch', fontWeight: 300, color: 'var(--text-muted)', textAlign: 'center' }}>
        We take on a limited number of weddings each season to give every couple our full attention behind the lens.
      </p>
      
      <div className={`${styles.formWrapper} reveal`}>

        <div className={styles.content}>
          {errorMsg && (
            <div className={styles.errorMessage}>
              {errorMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1Service
                key="step1"
                category={category}
                setCategory={setCategory}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <Step2Date
                key="step2"
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3Details
                key="step3"
                details={details}
                setDetails={setDetails}
                onBack={() => setStep(2)}
                onSubmit={submitInquiry}
                isSubmitting={isSubmitting}
              />
            )}
            {step === 4 && (
              <Step4Success
                key="step4"
                category={category!}
                selectedDate={selectedDate!}
                location={details.location}
                onClose={resetForm}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
