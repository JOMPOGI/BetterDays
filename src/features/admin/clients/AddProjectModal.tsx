import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { supabase } from '@/integrations/supabase/client';
import styles from './AddProjectModal.module.css';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: () => void; // called after a successful save, so the parent can refetch
}

const PACKAGE_TYPE_BY_LABEL: Record<string, string> = {
  'Wedding Premium': 'wedding',
  'Wedding Classic': 'wedding',
  'Prenup + Wedding': 'wedding_prenup',
  'Prenup Only': 'prenup',
};

export function AddProjectModal({ isOpen, onClose, onAdd = () => {} }: AddProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pkgLabel, setPkgLabel] = useState('');
  const [date, setDate] = useState('');
  const [dpStatus, setDpStatus] = useState('Unpaid');
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let clientId: string;
      const { data: existing } = await supabase.from('clients').select('id').eq('email', email).maybeSingle();
      if (existing) {
        clientId = existing.id;
      } else {
        const { data: created, error: createError } = await supabase
          .from('clients')
          .insert({ full_name: name, email, phone })
          .select('id')
          .single();
        if (createError) throw createError;
        clientId = created.id;
      }

      const packageType = PACKAGE_TYPE_BY_LABEL[pkgLabel] || 'wedding';

      const { error: bookingError } = await supabase.from('bookings').insert({
        client_id: clientId,
        event_date: date,
        package_type: packageType,
        status: dpStatus === 'Paid' ? 'CONFIRMED' : 'PENDING_PAYMENT',
      });
      if (bookingError) throw bookingError;

      addToast('Project added successfully!', 'success');
      onAdd();
      onClose();
      setName(''); setEmail(''); setPhone(''); setPkgLabel(''); setDate(''); setDpStatus('Unpaid');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Could not add project.', 'error');
    } finally {
      setLoading(false);
    }
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
            <label>Email</label>
            <input type="email" placeholder="hello@example.com" required className={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Phone</label>
            <input type="tel" placeholder="+63 9XX XXX XXXX" className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Service Package</label>
            <select className={styles.input} required value={pkgLabel} onChange={e => setPkgLabel(e.target.value)}>
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
          <select className={styles.input} value={dpStatus} onChange={e => setDpStatus(e.target.value)}>
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
