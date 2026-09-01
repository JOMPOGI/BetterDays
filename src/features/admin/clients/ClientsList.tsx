import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpDown, Plus } from 'lucide-react';
import { formatDisplayDate } from '@/utils/date';
import styles from './ClientsList.module.css';
import { AddProjectModal } from './AddProjectModal';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { supabase } from '@/integrations/supabase/client';

type Booking = {
  id: string;
  client_id?: string | null;
  package_type?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  prenup_date?: string | null;
  status?: string | null;
  clients?: { full_name?: string | null } | null;
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

const isActive = (status?: string | null) =>
  ['PENDING', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED'].includes(String(status || '').toUpperCase());

export function ClientsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Date');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, clients(full_name)')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('ClientsList bookings:', error);
    } else {
      setBookings((data || []) as Booking[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel('admin-projects-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, load)
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, []);

  const rows = useMemo(() => bookings.filter(b => isActive(b.status)).map(b => ({
    id: b.id,
    name: b.clients?.full_name || 'Unknown client',
    package: packageLabel(b),
    date: formatDisplayDate(b.event_date),
    prenupDate: b.prenup_date ? formatDisplayDate(b.prenup_date) : null,
    rawDate: b.event_date || b.prenup_date || '',
  })), [bookings]);

  const filteredClients = rows
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Name') return a.name.localeCompare(b.name);
      if (sortBy === 'Package') return a.package.localeCompare(b.package);
      return new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime();
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
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '3rem 0', textAlign: 'center' }}>Loading…</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '3rem 0' }}>
                    <EmptyState
                      title="No projects found"
                      description="Bookings made through the website will show up here."
                    />
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id}>
                    <td><div className={styles.coupleCell}>{client.name}</div></td>
                    <td>
                      {client.package}
                      {client.prenupDate && client.prenupDate !== client.date && (
                        <div style={{ fontSize: '0.75rem', opacity: 0.65 }}>Prenup: {client.prenupDate}</div>
                      )}
                    </td>
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
        <div>{filteredClients.length} project{filteredClients.length === 1 ? '' : 's'}</div>
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={() => { setIsModalOpen(false); load(); }}
      />
    </div>
  );
}
