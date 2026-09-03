import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { supabase } from '@/integrations/supabase/client';
import styles from './Payments.module.css';
import { AddPaymentModal } from './AddPaymentModal';

type Booking = {
  id: string;
  client_id?: string | null;
  package_type?: string | null;
  package_total?: number | null;
  updated_at?: string | null;
  clients?: { full_name?: string | null } | null;
};

type Payment = {
  id: string;
  booking_id: string | null;
  amount: number;
  status: string | null;
  paid_at: string | null;
};

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [arEntry, setArEntry] = useState<{ client: string; amount: number } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const formatCurrency = (amount: number) =>
    `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const load = async () => {
    const [{ data: bookingsData, error: bookingsError }, { data: paymentsData, error: paymentsError }] = await Promise.all([
      supabase.from('bookings').select('*, clients(full_name)').order('updated_at', { ascending: false }),
      supabase.from('payments').select('id, booking_id, amount, status, paid_at'),
    ]);

    if (bookingsError) console.error('Payments bookings:', bookingsError);
    if (paymentsError) console.error('Payments ledger:', paymentsError);

    setBookings((bookingsData || []) as Booking[]);
    setPayments((paymentsData || []) as Payment[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel('admin-payments-ledger')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, load)
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, []);

  const ledger = useMemo(() => bookings.map((b) => {
    const paidForBooking = payments.filter((p) => p.booking_id === b.id && p.status === 'paid');
    const paid = paidForBooking.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const total = Number(b.package_total || 0);
    const balance = Math.max(total - paid, 0);
    const lastUpdate = paidForBooking.length
      ? paidForBooking.reduce((latest, p) => (p.paid_at && p.paid_at > latest ? p.paid_at : latest), paidForBooking[0].paid_at || '')
      : b.updated_at;

    return {
      id: b.id,
      date: lastUpdate ? format(new Date(lastUpdate), 'MMM d, yyyy') : '—',
      client: b.clients?.full_name || 'Unknown client',
      packageTotal: total,
      paid,
      balance,
      status: total > 0 && balance <= 0 ? 'Fully Paid' : paid > 0 ? 'Partial DP' : 'Unpaid',
    };
  }), [bookings, payments]);

  const filteredLedger = ledger.filter((entry) =>
    entry.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Payments</h1>
          <p>Track client package totals, payments made, and remaining balances</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search client..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.filterBtn} onClick={() => addToast('Filtering coming soon', 'info')}>
            <Filter size={18} />
          </button>
          <button className={styles.recordBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Record Payment
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>LATEST UPDATE</th>
                <th>CLIENT</th>
                <th className={styles.rightAlign}>PACKAGE TOTAL</th>
                <th className={styles.rightAlign}>AMOUNT PAID</th>
                <th className={styles.rightAlign}>BALANCE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '3rem 0', textAlign: 'center' }}>Loading…</td></tr>
              ) : filteredLedger.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '3rem 0', textAlign: 'center' }}>No payment records yet.</td></tr>
              ) : (
                filteredLedger.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td><strong>{entry.client}</strong></td>
                    <td className={styles.rightAlign}>{formatCurrency(entry.packageTotal)}</td>
                    <td className={`${styles.rightAlign} ${styles.amountCredit}`}>{formatCurrency(entry.paid)}</td>
                    <td className={`${styles.rightAlign} ${styles.amountBalance}`}>{formatCurrency(entry.balance)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${entry.balance === 0 && entry.packageTotal > 0 ? styles.statusPaid : styles.statusPending}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td>
                      {entry.balance > 0 ? (
                        <button className={`${styles.actionBtn} ${styles.actionBtnSolidGold}`} onClick={() => addToast(`Payment reminder email sent to ${entry.client}!`, 'success')}>
                          Send Reminder
                        </button>
                      ) : (
                        <button className={`${styles.actionBtn} ${styles.actionBtnOutlineGold}`} onClick={() => setArEntry({ client: entry.client, amount: entry.paid })}>
                          View AR
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.footer}>
        <div>{filteredLedger.length} record{filteredLedger.length === 1 ? '' : 's'}</div>
      </div>

      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={load}
      />

      {arEntry && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'var(--overlay-bg, rgba(0,0,0,0.85))', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)'}}>
          <div style={{background: '#ffffff', color: '#000000', padding: '3rem', borderRadius: '0', width: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', fontFamily: 'var(--mono)'}}>
            <button onClick={() => setArEntry(null)} style={{position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#000000'}}><X size={24}/></button>

            <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #000', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Better Days Studios</h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>123 Creative Hub, Manila, Philippines</p>
            </div>

            <h1 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acknowledgment Receipt</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p style={{ margin: 0 }}><strong>Client:</strong> {arEntry.client}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>AR No:</strong> BDS-{Math.floor(Math.random() * 100000)}</p>
                <p style={{ margin: 0 }}><strong>Status:</strong> FULLY PAID</p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>This is to acknowledge receipt of payment in the amount of:</p>
              <div style={{ background: '#f5f5f5', padding: '1rem', border: '1px solid #e0e0e0', fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center' }}>
                PHP {arEntry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ textAlign: 'center', width: '200px' }}>
                <div style={{ borderBottom: '1px solid #000', marginBottom: '0.5rem', height: '30px' }}></div>
                <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase' }}>Authorized Signatory</p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className={styles.actionBtnSolid} onClick={() => addToast('Receipt downloading...', 'success')}>Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
