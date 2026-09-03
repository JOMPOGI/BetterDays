import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDisplayDate } from '@/utils/date';

import { Checkbox } from '../../../components/ui/Checkbox/Checkbox';
import { useToast } from '../../../components/ui/Toast/ToastContext';
import { supabase } from '@/integrations/supabase/client';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import styles from './ClientProfile.module.css';
import { AddPaymentModal } from '../payments/AddPaymentModal';

type Client = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

type Booking = {
  id: string;
  client_id?: string | null;
  package_type?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  prenup_date?: string | null;
  location?: string | null;
  prenup_location?: string | null;
  package_total?: number | null;
  reservation_amount?: number | null;
  status?: string | null;
  updated_at?: string | null;
  clients?: Client | null;
};

type Payment = {
  id: string;
  booking_id: string | null;
  amount: number;
  status: string | null;
  paid_at: string | null;
  method?: string | null;
};

const PACKAGE_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  prenup: 'Prenup',
  wedding_prenup: 'Wedding + Prenup',
};

const normalizePackage = (b: Booking) =>
  String(b.package_type || b.event_type || '').toLowerCase().replace(/[+\-]/g, '_').replace(/\s+/g, '_');

const packageLabel = (b: Booking) => {
  const key = normalizePackage(b);
  return PACKAGE_LABELS[key] || key || '—';
};

const formatCurrency = (amount: number) =>
  `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (value?: string | null) => formatDisplayDate(value, 'MMM d, yyyy');

export function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { addToast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [pipelineState, setPipelineState] = useState<Record<string, boolean>>({
    Booking: true,
    Payment: false,
    Questionnaire: false,
    Consultation: false,
    Prenup: false,
    Wedding: false,
    Editing: false,
    Delivered: false
  });

  const togglePipeline = (key: string) => setPipelineState(prev => ({ ...prev, [key]: !prev[key] }));

  const scrollTo = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Load the specific booking that was clicked (from the calendar or the
  // projects list), not just "some" booking — this is keyed off the :id
  // route param, which is the booking id.
  const load = async () => {
    if (!id) return;
    setLoading(true);

    const [{ data: bookingData, error: bookingError }, { data: paymentsData, error: paymentsError }] = await Promise.all([
      supabase.from('bookings').select('*, clients(*)').eq('id', id).maybeSingle(),
      supabase.from('payments').select('*').eq('booking_id', id).order('paid_at', { ascending: true }),
    ]);

    if (bookingError) console.error('ClientProfile booking:', bookingError);
    if (paymentsError) console.error('ClientProfile payments:', paymentsError);

    if (!bookingData) {
      setNotFound(true);
      setBooking(null);
    } else {
      setNotFound(false);
      setBooking(bookingData as Booking);
    }
    setPayments((paymentsData || []) as Payment[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    if (!id) return;
    const channel = supabase
      .channel(`admin-client-profile-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `id=eq.${id}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments', filter: `booking_id=eq.${id}` }, load)
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const paidPayments = useMemo(() => payments.filter(p => p.status === 'paid'), [payments]);
  const paidTotal = useMemo(() => paidPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [paidPayments]);
  const packageTotal = Number(booking?.package_total || 0);
  const balance = Math.max(packageTotal - paidTotal, 0);

  if (loading) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', minHeight: '50vh' }}>
        <Spinner size={28} />
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div className={styles.container}>
        <EmptyState title="Project not found" description="This booking may have been removed or the link is out of date." />
      </div>
    );
  }

  const client = booking.clients;
  const name = client?.full_name || 'Unknown client';
  const packageType = normalizePackage(booking);
  const hasWedding = packageType === 'wedding' || packageType === 'wedding_prenup';
  const hasPrenup = packageType === 'prenup' || packageType === 'wedding_prenup' || Boolean(booking.prenup_date);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 className={styles.title} style={{ margin: 0 }}>{name}</h1>
            <div>
              <span className={styles.eventTypeBadge}>{packageLabel(booking)}</span>
            </div>
          </div>
        </div>
        <button className={styles.editBtn} onClick={() => addToast('Editing profile is coming soon.', 'info')}>Edit Profile</button>
      </div>

      <div className={styles.navTabs}>
        <a href="#operations" className={styles.navTab} onClick={(e) => scrollTo('operations', e)}>Operations</a>
        <a href="#financials" className={styles.navTab} onClick={(e) => scrollTo('financials', e)}>Financials</a>
        <a href="#details" className={styles.navTab} onClick={(e) => scrollTo('details', e)}>Client Details</a>
      </div>

      <div className={styles.unifiedDashboard}>

        {/* SECTION 1: Operations */}
        <section id="operations" className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Operations & Schedule</h2>
          <div className={styles.dashboardRow}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Production Pipeline</h2>
              <div className={styles.checklist}>
                {Object.entries(pipelineState).map(([key, value]) => (
                  <Checkbox key={key} checked={value} onChange={() => togglePipeline(key)} label={key} />
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Events Schedule</h2>
              <div className={styles.eventsList}>
                {hasWedding && booking.event_date && (
                  <div className={styles.eventCard}>
                    <h4>Wedding Day</h4>
                    <p><strong>Date:</strong> {formatDate(booking.event_date)}</p>
                    {booking.location && <p><strong>Location:</strong> {booking.location}</p>}
                  </div>
                )}
                {hasPrenup && (booking.prenup_date || booking.event_date) && (
                  <div className={styles.eventCard}>
                    <h4>Prenup Session</h4>
                    <p><strong>Date:</strong> {formatDate(booking.prenup_date || booking.event_date)}</p>
                    {booking.prenup_location && <p><strong>Location:</strong> {booking.prenup_location}</p>}
                  </div>
                )}
                {!booking.event_date && !booking.prenup_date && (
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>No dates scheduled yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Financials */}
        <section id="financials" className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Financials & Scope</h2>
          <div className={styles.dashboardRow}>
            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className={styles.cardTitle} style={{ margin: 0 }}>Financial Ledger</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className={styles.editBtn} onClick={() => addToast('Payment reminder sent successfully.', 'success')}>Remind Payment</button>
                  <button className={styles.recordBtn} onClick={() => setIsPaymentModalOpen(true)}>Record Payment</button>
                </div>
              </div>

              <div className={styles.metricsRow} style={{ marginBottom: '2rem' }}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Event Date</span>
                  <span className={styles.metricValue}>{formatDate(booking.event_date || booking.prenup_date)}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Package Worth</span>
                  <span className={styles.metricValue}>{formatCurrency(packageTotal)}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Paid DP</span>
                  <span className={styles.metricValue}>{formatCurrency(paidTotal)}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Outstanding Balance</span>
                  <span className={styles.metricValueGold}>{formatCurrency(balance)}</span>
                </div>
              </div>

              <table className={styles.paymentTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th className={styles.rightAlign}>Amount Paid</th>
                    <th className={styles.rightAlign}>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {paidPayments.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No payments recorded yet.</td></tr>
                  ) : (
                    (() => {
                      let running = packageTotal;
                      return paidPayments.map(p => {
                        running -= Number(p.amount || 0);
                        return (
                          <tr key={p.id}>
                            <td>{formatDate(p.paid_at)}</td>
                            <td>{p.method || 'Payment'}</td>
                            <td className={styles.rightAlign}>{formatCurrency(Number(p.amount || 0))}</td>
                            <td className={styles.rightAlign}>{formatCurrency(Math.max(running, 0))}</td>
                          </tr>
                        );
                      });
                    })()
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Booking & Scope</h2>
              <div className={styles.bookingBox}>
                <p><strong>Selected Package:</strong> {packageLabel(booking)} ({formatCurrency(packageTotal)})</p>
                <p><strong>Status:</strong> {String(booking.status || '—').replace(/_/g, ' ')}</p>
                {booking.location && <p><strong>Wedding Location:</strong> {booking.location}</p>}
                {booking.prenup_location && <p><strong>Prenup Location:</strong> {booking.prenup_location}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Client Details */}
        <section id="details" className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Client Details</h2>
          <div className={styles.dashboardRow}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Client Contact</h2>
              <div className={styles.contactGrid}>
                <div className={styles.contactBox}>
                  <p><strong>Name:</strong> {client?.full_name || '—'}</p>
                  <p><strong>Email:</strong> {client?.email || '—'}</p>
                  <p><strong>Phone:</strong> {client?.phone || '—'}</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Internal Notes</h2>
              <textarea className={styles.notesArea} defaultValue="" placeholder="Add internal notes about this project..." />
              <button className={styles.recordBtn} onClick={() => addToast('Internal notes saved.', 'success')}>Save Notes</button>
            </div>
          </div>

          <div className={styles.dashboardRow} style={{ gridTemplateColumns: '1fr' }}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Creative Vision (Questionnaire)</h2>
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
                No questionnaire responses submitted yet for this project.
              </p>
            </div>
          </div>
        </section>

      </div>

      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookingId={booking.id}
        projectName={`${name} - ${packageLabel(booking)}`}
        onSaved={load}
      />
    </div>
  );
}
