import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import styles from './Clients.module.css';

interface Client {
  email: string;
  name: string;
  phone: string;
  total_bookings: number;
  last_booking: string;
  status: string;
}

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
    const { data: bookingsData } = await supabase.from('bookings').select('*');
    
    if (clientsError) {
      console.error(clientsError);
      setLoading(false);
      return;
    }

    const formattedClients = (clientsData || []).map((client: any) => {
      const clientBookings = (bookingsData || []).filter((b: any) => b.client_id === client.id);
      
      const total_bookings = clientBookings.length;
      let last_booking = '-';
      let status = '-';
      
      if (total_bookings > 0) {
        // Sort to get latest
        clientBookings.sort((a: any, b: any) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
        last_booking = clientBookings[0].event_date;
        status = clientBookings[0].status;
      }

      return {
        email: client.email || 'No Email',
        name: client.full_name,
        phone: client.phone || '-',
        total_bookings,
        last_booking,
        status
      };
    });

    setClients(formattedClients);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <button className="backBtn" onClick={() => navigate('/admin')}>
        &larr; Back to Dashboard
      </button>
      <div className={styles.header}>
        <h1>Client Directory</h1>
        <p>Manage and track your clientele.</p>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <p>Loading clients...</p>
        ) : clients.length === 0 ? (
          <p>No clients found yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Bookings</th>
                <th>Last Booking</th>
                <th>Latest Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, idx) => (
                <tr key={idx}>
                  <td className={styles.primaryCell}>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{client.total_bookings}</td>
                  <td>{client.last_booking}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[client.status.toLowerCase()]}`}>
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
