import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import styles from './AddProjectModal.module.css';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (project: any) => void;
}

export function AddProjectModal({ isOpen, onClose, onAdd = () => {} }: AddProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [pkg, setPkg] = useState('');
  const [date, setDate] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mocking an API call
    setTimeout(() => {
      setLoading(false);
      onAdd({ id: Math.random().toString(), name, package: pkg, date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
      onClose();
      addToast('Project added successfully!', 'success');
      setName('');
      setPkg('');
      setDate('');
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Project" size="md">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Couple's Names</label>
          <input type="text" placeholder="e.g. Maria & Juan" required className={styles.input} value={name} onChange={e => setName(e.target.value)} />
        </div>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Service Package</label>
            <select className={styles.input} required value={pkg} onChange={e => setPkg(e.target.value)}>
              <option value="">Select package...</option>
              <option value="Wedding Premium">Wedding Premium</option>
              <option value="Wedding Classic">Wedding Classic</option>
              <option value="Prenup + Wedding">Prenup + Wedding</option>
              <option value="Prenup Only">Prenup Only</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Event Date</label>
            <input type="date" required className={styles.input} value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Initial Downpayment Status</label>
          <select className={styles.input}>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid (Cash / Bank)</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            {loading ? <><Spinner size={16} color="#ffffff" /> Saving...</> : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
