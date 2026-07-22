import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
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

  const submitInquiry = async () => {
    if (!selectedDate || !category) return;
    
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate a random double booking error (10% chance) just to show it works
      if (Math.random() < 0.1) {
        setErrorMsg('Sorry, this date was just requested by another client. Please choose another available date.');
        setStep(2); // Go back to calendar
        return;
      }

      // Success
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
        <div className={styles.header}>
          <h2>INQUIRE</h2>
        </div>

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
