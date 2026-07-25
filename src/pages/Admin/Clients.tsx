import { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    // In a real app, this would be a specialized RPC or a complex query.
    // For our mock, we'll fetch all inquiries and aggregate them by email.
    const { data, error } = await supabase.from('inquiries').select('*');
    
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const clientMap = new Map<string, Client>();

    (data || []).forEach((booking: any) => {
      const email = booking.email || 'No Email Provided';
      if (!clientMap.has(email)) {
        clientMap.set(email, {
          email,
          name: booking.client_name,
          phone: booking.phone || '-',
          total_bookings: 1,
          last_booking: booking.event_date,
          status: booking.status
        });
      } else {
        const existing = clientMap.get(email)!;
        existing.total_bookings += 1;
        if (new Date(booking.event_date) > new Date(existing.last_booking)) {
          existing.last_booking = booking.event_date;
          existing.status = booking.status;
        }
      }
    });

    setClients(Array.from(clientMap.values()));
    setLoading(false);
  };

  return (
    <div className={styles.container}>
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
