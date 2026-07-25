import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Bell, CheckCircle } from 'lucide-react';
import styles from './Notifications.module.css';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  link_id: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setNotifications(data);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    for (const n of unread) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', n.id);
    }
    fetchNotifications();
  };

  return (
    <div className={styles.container}>
      <button className="backBtn" onClick={() => navigate('/admin')}>
        &larr; Back to Dashboard
      </button>
      <div className={styles.header}>
        <div>
          <h1>Notifications</h1>
          <p>Stay updated on new inquiries and booking activities.</p>
        </div>
        <button className={styles.markAllBtn} onClick={markAllAsRead}>
          Mark all as read
        </button>
      </div>

      <div className={styles.list}>
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell size={48} opacity={0.2} />
            <p>You're all caught up!</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`${styles.notifCard} ${notif.is_read ? styles.read : ''}`}>
              <div className={styles.notifIcon}>
                <Bell size={20} />
              </div>
              <div className={styles.notifContent}>
                <p>{notif.message}</p>
                <span>{formatDistanceToNow(new Date(notif.created_at))} ago</span>
              </div>
              {!notif.is_read && (
                <button 
                  className={styles.checkBtn} 
                  onClick={() => markAsRead(notif.id)}
                  title="Mark as read"
                >
                  <CheckCircle size={20} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
