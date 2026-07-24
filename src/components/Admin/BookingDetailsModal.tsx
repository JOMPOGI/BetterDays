import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Booking } from '../../pages/Admin/Calendar';
import styles from './BookingDetailsModal.module.css';

interface BookingDetailsModalProps {
  bookingId: string | null; // null means new manual booking
  onClose: (wasUpdated: boolean) => void;
}

export function BookingDetailsModal({ bookingId, onClose }: BookingDetailsModalProps) {
  const [booking, setBooking] = useState<Partial<Booking>>({
    status: 'PENDING',
    source: 'PHONE',
    service_type: 'Wedding',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) {
      setError('Failed to load booking details');
      console.error(error);
    } else {
      setBooking(data);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Basic validation
    if (booking.status === 'CONFIRMED') {
      // Check for conflicts if confirming
      const { data: conflicts, error: conflictError } = await supabase
        .from('inquiries')
        .select('id')
        .eq('event_date', booking.event_date)
        .eq('status', 'CONFIRMED')
        .neq('id', bookingId || '00000000-0000-0000-0000-000000000000'); // Ignore self

      if (conflictError) {
        setError('Failed to check conflicts.');
        setSaving(false);
        return;
      }

      if (conflicts && conflicts.length > 0) {
        setError('Cannot confirm. Another confirmed booking exists for this date.');
        setSaving(false);
        return;
      }
    }

    if (bookingId) {
      // Update existing
      const { error } = await supabase
        .from('inquiries')
        .update({
          ...booking,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        setError('Failed to update booking.');
      } else {
        onClose(true);
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          ...booking,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }]);

      if (error) {
        setError('Failed to create booking.');
      } else {
        onClose(true);
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!bookingId || !window.confirm('Are you sure you want to delete this booking?')) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', bookingId);
      
    if (error) {
      setError('Failed to delete.');
      setSaving(false);
    } else {
      onClose(true);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{bookingId ? 'Booking Details' : 'New Manual Booking'}</h2>
          <button type="button" onClick={() => onClose(false)} className={styles.closeBtn}>×</button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <form onSubmit={handleSave} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.sections}>
              <div className={styles.section}>
                <h3>Client Details</h3>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input required name="client_name" value={booking.client_name || ''} onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input name="phone" value={booking.phone || ''} onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input type="email" name="email" value={booking.email || ''} onChange={handleChange} />
                </div>
                {bookingId && (
                  <div className={styles.quickActions}>
                    {booking.phone && <a href={`tel:${booking.phone}`} className={styles.actionBtn}>CALL</a>}
                    {booking.phone && <a href={`sms:${booking.phone}`} className={styles.actionBtn}>SMS</a>}
                    {booking.email && <a href={`mailto:${booking.email}`} className={styles.actionBtn}>EMAIL</a>}
                  </div>
                )}
              </div>

              <div className={styles.section}>
                <h3>Event Details</h3>
                <div className={styles.inputGroup}>
                  <label>Service</label>
                  <select required name="service_type" value={booking.service_type || ''} onChange={handleChange}>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Portrait / Studio">Portrait / Studio</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Date</label>
                  <input type="date" required name="event_date" value={booking.event_date || ''} onChange={handleChange} />
                </div>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Start Time</label>
                    <input type="time" required name="start_time" value={booking.start_time || ''} onChange={handleChange} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>End Time</label>
                    <input type="time" required name="end_time" value={booking.end_time || ''} onChange={handleChange} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Location</label>
                  <input name="location" value={booking.location || ''} onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Event Description</label>
                  <textarea name="project_notes" value={booking.project_notes || ''} onChange={handleChange} rows={3}></textarea>
                </div>
              </div>

              <div className={styles.section}>
                <h3>Booking Status</h3>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Status</label>
                    <select required name="status" value={booking.status || ''} onChange={handleChange} className={styles[`status_${booking.status}`]}>
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Source</label>
                    <select required name="source" value={booking.source || ''} onChange={handleChange}>
                      <option value="WEBSITE">Website</option>
                      <option value="FACEBOOK">Facebook</option>
                      <option value="PHONE">Phone</option>
                      <option value="SMS">SMS</option>
                      <option value="WALK_IN">Walk In</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Admin Notes</label>
                  <textarea name="admin_notes" value={booking.admin_notes || ''} onChange={handleChange} rows={4} placeholder="Internal notes (not visible to client)"></textarea>
                </div>
                
                {bookingId && booking.created_at && (
                  <div className={styles.meta}>
                    Submitted: {new Date(booking.created_at).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.footer}>
              {bookingId ? (
                <button type="button" onClick={handleDelete} className={styles.deleteBtn} disabled={saving}>
                  Delete
                </button>
              ) : <div></div>}
              <div className={styles.primaryActions}>
                <button type="button" onClick={() => onClose(false)} className={styles.cancelBtn} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
