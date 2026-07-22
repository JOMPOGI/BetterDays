import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import styles from './Step3Details.module.css';

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  social: string;
  location: string;
  notes: string;
}

interface Step3DetailsProps {
  details: UserDetails;
  setDetails: (d: UserDetails) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function Step3Details({
  details,
  setDetails,
  onBack,
  onSubmit,
  isSubmitting
}: Step3DetailsProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const isFormValid = details.name.trim() !== '' && details.email.trim() !== '' && details.phone.trim() !== '' && details.location.trim() !== '';

  return (
    <motion.div 
      className={styles.stepContainer}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className={styles.titleArea}>
        <button className={styles.backLink} onClick={onBack} type="button">
          <ChevronLeft size={16} /> Back
        </button>
        <h3>Almost done</h3>
        <p>Just a few details to secure your date.</p>
      </div>

      <form 
        className={styles.form} 
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid) onSubmit();
        }}
      >
        <div className={styles.field}>
          <label htmlFor="name">Full Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={details.name} 
            onChange={handleChange}
            required 
            placeholder="Jane Doe"
          />
        </div>
        
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="email">Email Address *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={details.email} 
              onChange={handleChange}
              required 
              placeholder="jane@example.com"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="phone">Phone Number *</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={details.phone} 
              onChange={handleChange}
              required 
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="social">Social Handle (Optional)</label>
          <input 
            type="text" 
            id="social" 
            name="social" 
            value={details.social} 
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="location">Location / Venue Name *</label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            value={details.location} 
            onChange={handleChange}
            required
            placeholder="Venue Address"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="notes">Project Notes (Optional)</label>
          <textarea 
            id="notes" 
            name="notes" 
            rows={3} 
            value={details.notes} 
            onChange={handleChange}
            placeholder="Any specific requests or ideas?"
          ></textarea>
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'SENDING...' : 'SEND INQUIRY'}
        </button>
      </form>
    </motion.div>
  );
}
