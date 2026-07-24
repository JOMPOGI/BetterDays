import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';

import styles from './InquiryPanel.module.css';

import { Step1Service, type Category } from './InquiryFlow/Step1Service';
import { Step2Date } from './InquiryFlow/Step2Date';
import { Step3Details } from './InquiryFlow/Step3Details';
import { Step4Success } from './InquiryFlow/Step4Success';

interface InquiryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InquiryPanel({ isOpen, onClose }: InquiryPanelProps) {
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

  const handleClose = () => {
    // Reset state after animation completes
    setTimeout(() => {
      setStep(1);
      setCategory(null);
      setSelectedDate(null);
      setDetails({ name: '', email: '', phone: '', social: '', location: '', notes: '' });
      setErrorMsg('');
    }, 500);
    onClose();
  };

  const submitInquiry = async (turnstileToken: string) => {
    if (!selectedDate || !category) return;
    
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.from('inquiries').insert([{
        client_name: details.name,
        email: details.email,
        phone: details.phone,
        location: details.location,
        project_notes: details.notes,
        service_type: category.type,
        event_date: selectedDate.toISOString().split('T')[0],
        start_time: '09:00', // Default start time
        end_time: '18:00', // Default end time
        status: 'PENDING',
        source: 'WEBSITE'
      }]);

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className={styles.panel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h2>INQUIRE</h2>
              <button onClick={handleClose} className={styles.closeBtn} aria-label="Close inquiry panel">
                <X size={24} />
              </button>
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
                    onClose={handleClose}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
