import { useState } from 'react';
import { Search, Plus, Filter, MessageSquare, Phone, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import styles from './InquiriesDashboard.module.css';

const mockInquiries = [
  { id: '1', name: 'Alex & Sam', date: 'Oct 20, 2026', type: 'Wedding', status: 'New', email: 'alex@example.com', phone: '+63 917 111 2222', message: 'Looking for full coverage.' },
  { id: '2', name: 'Chris & Pat', date: 'Nov 5, 2026', type: 'Prenup', status: 'Contacted', email: 'chris@example.com', phone: '+63 918 333 4444', message: 'Intramuros shoot.' },
  { id: '3', name: 'Jordan & Taylor', date: 'Sep 15, 2026', type: 'Wedding', status: 'Meeting Set', email: 'jordan@example.com', phone: '+63 919 555 6666', message: 'Destination wedding in Tagaytay.' },
  { id: '4', name: 'Casey & Morgan', date: 'Dec 10, 2026', type: 'Wedding Premium', status: 'Contract Sent', email: 'casey@example.com', phone: '+63 920 777 8888', message: 'Waiting on contract signing.' }
];

const columns = ['New', 'Contacted', 'Meeting Set', 'Contract Sent'];

export function Inquiries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const filteredInquiries = mockInquiries.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || i.type.includes(filterType);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Inquiries & Leads</h1>
          <p>Manage incoming requests and convert leads into official projects</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search inquiries..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className={styles.filterBtn} 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            style={{ appearance: 'auto', paddingRight: '24px' }}
          >
            <option value="All">All Types</option>
            <option value="Wedding">Wedding</option>
            <option value="Prenup">Prenup</option>
          </select>
          <button className={styles.recordBtn}>
            <Plus size={18} /> Add Manual Lead
          </button>
        </div>
      </div>

      <div className={styles.kanbanBoard}>
        {columns.map(col => (
          <div key={col} className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <h3 className={styles.columnTitle}>{col}</h3>
              <span className={styles.columnCount}>
                {filteredInquiries.filter(i => i.status === col).length}
              </span>
            </div>
            
            <div className={styles.columnList}>
              {filteredInquiries.filter(i => i.status === col).length === 0 ? (
                <div style={{ padding: '2rem 0', background: 'var(--admin-card-bg)', borderRadius: '8px' }}>
                  <EmptyState title={`No ${col} inquiries`} description="" />
                </div>
              ) : (
                filteredInquiries.filter(i => i.status === col).map(inq => (
                  <div key={inq.id} className={styles.kanbanCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardType}>{inq.type}</span>
                      <span className={styles.cardDate}>{inq.date}</span>
                    </div>
                    <h4 className={styles.cardName}>{inq.name}</h4>
                    
                    <div className={styles.cardContact}>
                      <div className={styles.contactItem}><MessageSquare size={14} /> {inq.email}</div>
                      <div className={styles.contactItem}><Phone size={14} /> {inq.phone}</div>
                    </div>
                    
                    <p className={styles.cardMessage}>"{inq.message}"</p>
                    
                    <div className={styles.cardActions}>
                      <button className={styles.outlineBtn} onClick={() => addToast('Viewing details is coming soon.', 'info')}>View</button>
                      {col === 'Contract Sent' && (
                        <button className={styles.solidBtn} onClick={() => addToast('Inquiry converted to an active Project!', 'success')}>
                          Convert <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
