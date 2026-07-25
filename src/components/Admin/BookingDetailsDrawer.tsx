import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Calendar as CalendarIcon, User, Clock, MapPin, Tag, Navigation } from 'lucide-react';
import styles from './BookingDetailsDrawer.module.css';

interface BookingDetailsDrawerProps {
  bookingId: string | null;
  onClose: (wasUpdated: boolean) => void;
}

export function BookingDetailsDrawer({ bookingId, onClose }: BookingDetailsDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>({});
  const [client, setClient] = useState<any>({});
  const [inquiry, setInquiry] = useState<any>({});
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    if (bookingId) {
      fetchData();
    } else {
      setBooking({
        status: 'PENDING',
        event_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [bookingId]);

  const fetchData = async () => {
    setLoading(true);
    const { data: bData, error: bError } = await supabase.from('bookings').select('*').eq('id', bookingId).single();
    if (bError || !bData) {
      setError('Failed to load booking');
      setLoading(false);
      return;
    }
    setBooking(bData);

    if (bData.client_id) {
      const { data: cData } = await supabase.from('clients').select('*').eq('id', bData.client_id).single();
      if (cData) setClient(cData);
    }

    if (bData.inquiry_id) {
      const { data: iData } = await supabase.from('inquiries').select('*').eq('id', bData.inquiry_id).single();
      if (iData) setInquiry(iData);
    }

    // Mock DB fetch admin notes
    const { data: nData } = await supabase.from('admin_notes').select('*').eq('inquiry_id', bData.inquiry_id || 'xyz').single();
    if (nData) {
      setAdminNote(nData.note);
    }

    setLoading(false);
  };

  const handleBookingChange = (e: any) => setBooking({ ...booking, [e.target.name]: e.target.value });
  const handleClientChange = (e: any) => setClient({ ...client, [e.target.name]: e.target.value });
  const handleInquiryChange = (e: any) => setInquiry({ ...inquiry, [e.target.name]: e.target.value });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    let currentClientId = client.id;
    if (!currentClientId) {
       currentClientId = crypto.randomUUID();
       await supabase.from('clients').insert([{
         id: currentClientId,
         full_name: client.full_name,
         email: client.email,
         phone: client.phone
       }]);
    } else {
       await supabase.from('clients').update({
         full_name: client.full_name,
         email: client.email,
         phone: client.phone
       }).eq('id', currentClientId);
    }

    if (inquiry.id) {
      await supabase.from('inquiries').update({
        event_type: inquiry.event_type,
        project_notes: inquiry.project_notes
      }).eq('id', inquiry.id);
    }

    if (bookingId) {
      await supabase.from('bookings').update({
        event_date: booking.event_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        location: booking.location,
        status: booking.status
      }).eq('id', bookingId);
    } else {
      await supabase.from('bookings').insert([{
        id: crypto.randomUUID(),
        client_id: currentClientId,
        event_date: booking.event_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        location: booking.location,
        status: booking.status
      }]);
    }

    setSaving(false);
    onClose(true);
  };

  const handleDelete = async () => {
    if (!bookingId || !window.confirm('Are you sure you want to cancel this booking?')) return;
    setSaving(true);
    await supabase.from('bookings').update({ status: 'CANCELLED' }).eq('id', bookingId);
    setSaving(false);
    onClose(true);
  };

  return (
    <div className={styles.overlay} onClick={() => onClose(false)}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{bookingId ? 'Event Details' : 'New Event'}</h2>
          <button type="button" className={styles.closeBtn} onClick={() => onClose(false)}>
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading event details...</div>
        ) : (
          <form className={styles.content} onSubmit={handleSave}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.statusBanner}>
              <select name="status" value={booking.status || 'PENDING'} onChange={handleBookingChange} className={styles[`status_${booking.status}`]}>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <User size={18} />
                <h3>Client Information</h3>
              </div>
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input required name="full_name" value={client.full_name || ''} onChange={handleClientChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input type="email" name="email" value={client.email || ''} onChange={handleClientChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input name="phone" value={client.phone || ''} onChange={handleClientChange} />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <CalendarIcon size={18} />
                <h3>Event Information</h3>
              </div>
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Event Type</label>
                  <input required name="event_type" value={inquiry.event_type || 'Wedding'} onChange={handleInquiryChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Event Date</label>
                  <input type="date" required name="event_date" value={booking.event_date || ''} onChange={handleBookingChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Start Time</label>
                  <div className={styles.inputIconWrapper}>
                    <Clock size={16} />
                    <input type="time" name="start_time" value={booking.start_time || ''} onChange={handleBookingChange} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>End Time</label>
                  <div className={styles.inputIconWrapper}>
                    <Clock size={16} />
                    <input type="time" name="end_time" value={booking.end_time || ''} onChange={handleBookingChange} />
                  </div>
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label>Location</label>
                  <div className={styles.locationWrapper}>
                    <div className={styles.inputIconWrapper}>
                      <MapPin size={16} />
                      <input name="location" value={booking.location || ''} onChange={handleBookingChange} />
                    </div>
                    {booking.location && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.location)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.navigateBtn}
                        title="Open in Google Maps"
                      >
                        <Navigation size={18} />
                        Drive
                      </a>
                    )}
                  </div>
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label>Client Requirements / Message</label>
                  <textarea name="project_notes" value={inquiry.project_notes || ''} onChange={handleInquiryChange} rows={3}></textarea>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Tag size={18} />
                <h3>Booking Information</h3>
              </div>
              <div className={styles.grid}>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label>Internal Admin Notes</label>
                  <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={4} placeholder="Private notes visible only to admins..."></textarea>
                </div>
              </div>
              {inquiry.created_at && (
                <p className={styles.metaText}>Inquiry submitted on: {new Date(inquiry.created_at).toLocaleString()}</p>
              )}
            </div>

            <div className={styles.actions}>
              {bookingId && booking.status !== 'CANCELLED' && (
                <button type="button" onClick={handleDelete} className={styles.cancelBookingBtn} disabled={saving}>
                  Cancel Event
                </button>
              )}
              <div className={styles.primaryActions}>
                <button type="button" onClick={() => onClose(false)} className={styles.cancelBtn} disabled={saving}>
                  Close
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
