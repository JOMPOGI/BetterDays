import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import styles from './ProjectsDashboard.module.css';
import { User, Mail, Phone, ArrowRight, X, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Badge } from '@/components/ui/Badge/Badge';

interface ClientData {
  id: string;
  email: string | null;
  full_name: string;
  phone: string | null;
  created_at: string;
  total_bookings: number;
  last_booking: string;
  status: string;
  bookings: any[];
  inquiries: any[];
}

export function Clients() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
    const { data: bookingsData } = await supabase.from('bookings').select('*');
    const { data: inquiriesData } = await supabase.from('inquiries').select('*');
    
    if (clientsError) {
      console.error(clientsError);
      setLoading(false);
      return;
    }

    const formattedClients = (clientsData || []).map((client: any) => {
      const clientBookings = (bookingsData || []).filter((b: any) => b.client_id === client.id);
      const clientInquiries = (inquiriesData || []).filter((i: any) => i.client_id === client.id);
      
      const total_bookings = clientBookings.length;
      let last_booking = '-';
      let status = '-';
      
      if (total_bookings > 0) {
        clientBookings.sort((a: any, b: any) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
        last_booking = clientBookings[0].event_date;
        status = clientBookings[0].status;
      }

      return {
        ...client,
        total_bookings,
        last_booking,
        status,
        bookings: clientBookings,
        inquiries: clientInquiries.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      };
    });

    setClients(formattedClients);
    setLoading(false);
  };

  const filteredClients = clients.filter(c => 
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Client Directory</h1>
          <p>Manage and track your clientele.</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <Input 
            type="text" 
            placeholder="Search projects by name or email..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.emptyState}>Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className={styles.emptyState}>No clients found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Total Bookings</th>
                <th>Last Booking</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className={styles.tableRow} onClick={() => setSelectedClient(client)}>
                  <td className={styles.primaryCell}>
                    <div className={styles.clientAvatar}>
                      <User size={16} />
                    </div>
                    {client.full_name}
                  </td>
                  <td>
                    <div className={styles.contactCell}>
                      {client.email && <span><Mail size={12}/> {client.email}</span>}
                      {client.phone && <span><Phone size={12}/> {client.phone}</span>}
                    </div>
                  </td>
                  <td>{client.total_bookings}</td>
                  <td>{client.last_booking !== '-' ? format(new Date(client.last_booking), 'MMM d, yyyy') : '-'}</td>
                  <td>
                    <Badge variant={
                      client.status.toLowerCase() === 'confirmed' ? 'success' :
                      client.status.toLowerCase() === 'pending' ? 'warning' : 'default'
                    }>
                      {client.status}
                    </Badge>
                  </td>
                  <td>
                    <Button size="sm" variant="ghost">
                      View Project <ArrowRight size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CLIENT PROFILE DRAWER */}
      {selectedClient && (
        <div className={styles.overlay} onClick={() => setSelectedClient(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2>Client Profile</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedClient(null)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.drawerContent}>
              
              <div className={styles.profileHeader}>
                <div className={styles.largeAvatar}>
                  <User size={32} />
                </div>
                <div>
                  <h3>{selectedClient.full_name}</h3>
                  <p>Client since {format(new Date(selectedClient.created_at), 'MMMM yyyy')}</p>
                </div>
              </div>

              <div className={styles.section}>
                <h4><Mail size={16}/> Contact Information</h4>
                <div className={styles.infoCard}>
                  <div className={styles.infoRow}>
                    <span>Email Address</span>
                    <strong>{selectedClient.email || '-'}</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Phone Number</span>
                    <strong>{selectedClient.phone || '-'}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h4><Calendar size={16}/> Event History</h4>
                {selectedClient.bookings.length === 0 ? (
                  <div className={styles.emptyBox}>No bookings found.</div>
                ) : (
                  <div className={styles.timeline}>
                    {selectedClient.bookings.map(booking => (
                      <div key={booking.id} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineHeader}>
                            <strong>{format(new Date(booking.event_date), 'MMMM d, yyyy')}</strong>
                            <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className={styles.timelineBody}>
                            {booking.start_time && <span><Clock size={12}/> {booking.start_time} - {booking.end_time}</span>}
                            {booking.location && <span><MapPin size={12}/> {booking.location}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.section}>
                <h4><Tag size={16}/> Inquiry History</h4>
                {selectedClient.inquiries.length === 0 ? (
                  <div className={styles.emptyBox}>No inquiries found.</div>
                ) : (
                  <div className={styles.timeline}>
                    {selectedClient.inquiries.map(inq => (
                      <div key={inq.id} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineHeader}>
                            <strong>{inq.event_type}</strong>
                            <span>{format(new Date(inq.created_at), 'MMM d, yyyy')}</span>
                          </div>
                          <div className={styles.timelineBody}>
                            <p>{inq.project_notes || 'No message provided.'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
