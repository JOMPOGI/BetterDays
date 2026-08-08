import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import styles from './AddPaymentModal.module.css';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string; // Optional: If we know the project, pre-fill it
}

export function AddPaymentModal({ isOpen, onClose, projectName }: AddPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mocking an API call
    setTimeout(() => {
      setLoading(false);
      onClose();
      addToast('Payment recorded successfully!', 'success');
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment" size="md">
      <form onSubmit={handleSubmit} className={styles.form}>
        {!projectName && (
          <div className={styles.formGroup}>
            <label>Select Project</label>
            <select className={styles.input} required>
              <option value="">Choose project...</option>
              <option value="1">Garcia & Lim - Wedding Premium</option>
              <option value="2">Dela Cruz & Santos - Prenup + Wedding</option>
              <option value="3">Reyes & Tan - Wedding Classic</option>
              <option value="4">Cruz & Mendoza - Prenup Only</option>
            </select>
          </div>
        )}
        {projectName && (
          <div className={styles.projectInfo}>
            Recording payment for: <strong>{projectName}</strong>
          </div>
        )}

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Amount (₱)</label>
            <input type="number" placeholder="0.00" min="1" step="0.01" required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Date Received</label>
            <input type="date" required className={styles.input} defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Payment Method</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="method" value="Cash" required /> Cash
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="method" value="Bank Transfer" /> Bank Transfer
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="method" value="GCash" /> GCash
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Notes / Reference (Optional)</label>
          <input type="text" placeholder="e.g. BDO Ref #123456 or given in person" className={styles.input} />
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            {loading ? <><Spinner size={16} color="#ffffff" /> Saving...</> : 'Record Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
