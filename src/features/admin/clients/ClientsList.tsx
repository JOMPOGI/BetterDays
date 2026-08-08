import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Search, ArrowUpDown, Plus } from 'lucide-react';
import styles from './ClientsList.module.css';
import { AddProjectModal } from './AddProjectModal';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';

const mockClients = [
  { id: '1', name: 'Garcia & Lim', package: 'Wedding Premium', date: 'Oct 15, 2026' },
  { id: '2', name: 'Dela Cruz & Santos', package: 'Prenup + Wedding', date: 'Sep 3, 2026' },
  { id: '3', name: 'Reyes & Tan', package: 'Wedding Classic', date: 'Aug 25, 2026' },
  { id: '4', name: 'Cruz & Mendoza', package: 'Prenup Only', date: 'Nov 8, 2026' },
  { id: '5', name: 'Santos & Villanueva', package: 'Wedding Premium', date: 'Dec 12, 2026' }
];

export function ClientsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Date');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsList, setClientsList] = useState(mockClients);

  const page2Clients = [
    { id: '6', name: 'Tan & Uy', package: 'Wedding Classic', date: 'Jan 10, 2027' },
    { id: '7', name: 'Gomez & Perez', package: 'Prenup + Wedding', date: 'Feb 14, 2027' }
  ];

  const currentList = currentPage === 1 ? clientsList : page2Clients;

  const filteredClients = currentList
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Name') return a.name.localeCompare(b.name);
      if (sortBy === 'Package') return a.package.localeCompare(b.package);
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search projects by name..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.sortWrapper}>
          <div className={styles.selectWrapper} style={{ marginRight: '16px' }}>
            <select 
              className={styles.sortSelect} 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Date">Sort: Date</option>
              <option value="Name">Sort: Name</option>
              <option value="Package">Sort: Package</option>
            </select>
            <ArrowUpDown size={14} className={styles.selectIcon} />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className={styles.newBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--admin-text-dark)', color: '#fff', padding: '10px 16px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>COUPLE NAME</th>
                <th>SERVICE PACKAGE</th>
                <th>EVENT DATE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '3rem 0' }}>
                    <EmptyState 
                      title="No projects found" 
                      description="Try adjusting your search or filters." 
                    />
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id}>
                    <td>
                      <div className={styles.coupleCell}>
                        {client.name}
                      </div>
                    </td>
                    <td>{client.package}</td>
                    <td>{client.date}</td>
                    <td>
                      <div className={styles.actionsCell} style={{ justifyContent: 'flex-end' }}>
                        <Link to={`/admin/projects/${client.id}`} className={styles.profileBtn} style={{ background: '#222', color: '#fff', border: '1px solid #333' }}>
                          View Details &rarr;
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.footer}>
        <div>Showing {currentPage === 1 ? 1 : 6}-{currentPage === 1 ? filteredClients.length : 5 + filteredClients.length} of 7 clients</div>
        <div className={styles.pagination}>
          <button className={styles.pageBtn} onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>Previous</button>
          <button className={`${styles.pageBtn} ${currentPage === 1 ? styles.active : ''}`} onClick={() => setCurrentPage(1)}>1</button>
          <button className={`${styles.pageBtn} ${currentPage === 2 ? styles.active : ''}`} onClick={() => setCurrentPage(2)}>2</button>
          <button className={styles.pageBtn} onClick={() => setCurrentPage(2)} disabled={currentPage === 2}>Next</button>
        </div>
      </div>

      <AddProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={(project) => {
          setClientsList([project, ...clientsList]);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
