import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { supabase } from '@/integrations/supabase/client';
import { formatDateOnly } from '@/utils/date';
import styles from './AddPaymentModal.module.css';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;   // if known, skips the "select project" step
  projectName?: string; // display label when bookingId is pre-filled
  onSaved?: () => void; // called after a successful save, so the parent can refetch
}

interface BookingOption {
  id: string;
  label: string;
  client_id: string | null;
}

export function AddPaymentModal({ isOpen, onClose, bookingId, projectName, onSaved = () => {} }: AddPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<BookingOption[]>([]);
  const [selectedBooking, setSelectedBooking] = useState(bookingId || '');
  const [amount, setAmount] = useState('');
  const [dateReceived, setDateReceived] = useState(() => formatDateOnly(new Date()));
  const [method, setMethod] = useState('Cash');

  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && !bookingId) fetchOptions();
    setSelectedBooking(bookingId || '');
  }, [isOpen, bookingId]);

  const fetchOptions = async () => {
    const { data } = await supabase.from('bookings').select('id, client_id, package_type, clients(full_name)');
    if (!data) return;
    setOptions(
      data.map((b: any) => ({
        id: b.id,
        client_id: b.client_id,
        label: `${b.clients?.full_name || 'Client'} — ${b.package_type || 'Booking'}`,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) {
      addToast('Please select a project.', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data: booking } = await supabase.from('bookings').select('client_id').eq('id', selectedBooking).single();

      const { error } = await supabase.from('payments').insert({
        booking_id: selectedBooking,
        client_id: booking?.client_id ?? null,
        amount: parseFloat(amount),
        currency: 'PHP',
        method,
        provider: 'manual',
        status: 'paid',
        paid_at: dateReceived,
      });
      if (error) throw error;

      // A manually-recorded payment is the admin's confirmation that money
      // actually arrived — flip the booking out of PENDING_PAYMENT.
      await supabase.from('bookings').update({ status: 'CONFIRMED' }).eq('id', selectedBooking).eq('status', 'PENDING_PAYMENT');

      addToast('Payment recorded successfully!', 'success');
      onSaved();
      onClose();
      setAmount('');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Could not record payment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment" size="md">
      <form onSubmit={handleSubmit} className={styles.form}>
        {!bookingId && (
          <div className={styles.formGroup}>
            <label>Select Project</label>
            <select className={styles.input} required value={selectedBooking} onChange={(e) => setSelectedBooking(e.target.value)}>
              <option value="">Choose project...</option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        )}
        {bookingId && projectName && (
          <div className={styles.projectInfo}>
            Recording payment for: <strong>{projectName}</strong>
          </div>
        )}

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Amount (₱)</label>
            <input type="number" placeholder="0.00" min="1" step="0.01" required className={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Date Received</label>
            <input type="date" required className={styles.input} value={dateReceived} onChange={(e) => setDateReceived(e.target.value)} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Payment Method</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="method" value="Cash" checked={method === 'Cash'} onChange={(e) => setMethod(e.target.value)} required /> Cash
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="method" value="Bank Transfer" checked={method === 'Bank Transfer'} onChange={(e) => setMethod(e.target.value)} /> Bank Transfer
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="method" value="GCash" checked={method === 'GCash'} onChange={(e) => setMethod(e.target.value)} /> GCash
            </label>
          </div>
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
