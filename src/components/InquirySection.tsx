import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import styles from './InquirySection.module.css';

import { Step1Service, type Category } from './InquiryFlow/Step1Service';
import { Step2Date } from './InquiryFlow/Step2Date';
import { Step3Details } from './InquiryFlow/Step3Details';
import { Step4Success } from './InquiryFlow/Step4Success';

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
        p_event_date: selectedDate.toISOString().split('T')[0],
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
    <div className={styles.sectionContainer}>
      <div className={styles.formWrapper}>

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
