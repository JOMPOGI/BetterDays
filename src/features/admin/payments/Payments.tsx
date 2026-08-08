import { useState } from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';
import { useToast } from '@/components/ui/Toast/ToastContext';
import styles from './Payments.module.css';
import { AddPaymentModal } from './AddPaymentModal';

const mockLedger = [
  { id: '1', date: 'Aug 1, 2026', client: 'Garcia & Lim', packageTotal: 150000, paid: 65000, balance: 85000, status: 'Partial DP' },
  { id: '2', date: 'Aug 4, 2026', client: 'Santos & Villanueva', packageTotal: 120000, paid: 60000, balance: 60000, status: 'Partial DP' },
  { id: '3', date: 'Aug 10, 2026', client: 'Dela Cruz & Santos', packageTotal: 90000, paid: 45000, balance: 45000, status: 'Partial DP' },
  { id: '4', date: 'Aug 12, 2026', client: 'Reyes & Tan', packageTotal: 75000, paid: 75000, balance: 0, status: 'Fully Paid' },
];

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [arClient, setArClient] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToast } = useToast();

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const page2Ledger = [
    { id: '5', date: 'Aug 15, 2026', client: 'Velasquez & Go', packageTotal: 180000, paid: 90000, balance: 90000, status: 'Partial DP' },
    { id: '6', date: 'Aug 18, 2026', client: 'Sy & Lee', packageTotal: 85000, paid: 85000, balance: 0, status: 'Fully Paid' },
  ];

  const currentLedger = currentPage === 1 ? mockLedger : page2Ledger;

  const filteredLedger = currentLedger.filter(entry => 
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
              {filteredLedger.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>
                    <strong>{entry.client}</strong>
                  </td>
                  <td className={styles.rightAlign}>
                    {formatCurrency(entry.packageTotal)}
                  </td>
                  <td className={`${styles.rightAlign} ${styles.amountCredit}`}>
                    {formatCurrency(entry.paid)}
                  </td>
                  <td className={`${styles.rightAlign} ${styles.amountBalance}`}>
                    {formatCurrency(entry.balance)}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${entry.balance === 0 ? styles.statusPaid : styles.statusPending}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td>
                    {entry.balance > 0 ? (
                      <button className={`${styles.actionBtn} ${styles.actionBtnSolidGold}`} onClick={() => addToast(`Payment reminder email sent to ${entry.client}!`, 'success')}>
                        Send Reminder
                      </button>
                    ) : (
                      <button className={`${styles.actionBtn} ${styles.actionBtnOutlineGold}`} onClick={() => setArClient(entry.client)}>
                        View AR
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.footer}>
        <div>Showing {currentPage === 1 ? 1 : 5}-{currentPage === 1 ? filteredLedger.length : 4 + filteredLedger.length} of 6 records</div>
        <div className={styles.pagination}>
          <button className={styles.pageBtn} onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>Previous</button>
          <button className={`${styles.pageBtn} ${currentPage === 1 ? styles.active : ''}`} onClick={() => setCurrentPage(1)}>1</button>
          <button className={`${styles.pageBtn} ${currentPage === 2 ? styles.active : ''}`} onClick={() => setCurrentPage(2)}>2</button>
          <button className={styles.pageBtn} onClick={() => setCurrentPage(2)} disabled={currentPage === 2}>Next</button>
        </div>
      </div>

      <AddPaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {arClient && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'var(--overlay-bg, rgba(0,0,0,0.85))', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)'}}>
          <div style={{background: '#ffffff', color: '#000000', padding: '3rem', borderRadius: '0', width: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', fontFamily: 'var(--mono)'}}>
            <button onClick={() => setArClient(null)} style={{position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#000000'}}><X size={24}/></button>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #000', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Better Days Studios</h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>123 Creative Hub, Manila, Philippines</p>
            </div>

            <h1 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acknowledgment Receipt</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p style={{ margin: 0 }}><strong>Client:</strong> {arClient}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>AR No:</strong> BDS-{Math.floor(Math.random() * 100000)}</p>
                <p style={{ margin: 0 }}><strong>Status:</strong> FULLY PAID</p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>This is to acknowledge receipt of payment in the amount of:</p>
              <div style={{ background: '#f5f5f5', padding: '1rem', border: '1px solid #e0e0e0', fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center' }}>
                PHP 75,000.00
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
