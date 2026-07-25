import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import styles from './Inquiries.module.css';
import { format } from 'date-fns';
import { Mail, Inbox as InboxIcon, Archive, Trash2, Circle, CheckCircle2, CalendarPlus, CornerUpLeft } from 'lucide-react';

export interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
}

export interface Inquiry {
  id: string;
  client_id: string;
  client?: Client;
  event_type: string;
  event_date: string;
  location: string | null;
  project_notes: string | null;
  status: string;
  is_read: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  created_at: string;
}

export function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<'INBOX' | 'UNREAD' | 'ARCHIVED' | 'TRASH'>('INBOX');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: clientsData } = await supabase.from('clients').select('*');
    const { data: inquiriesData, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    
    if (!error && inquiriesData) {
      const merged = inquiriesData.map((inq: any) => ({
        ...inq,
        client: clientsData?.find((c: any) => c.id === inq.client_id)
      }));
      setInquiries(merged);
    }
    setLoading(false);
  };

  const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
    await supabase.from('inquiries').update(updates).eq('id', id);
    fetchData();
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, ...updates });
    }
  };

  const handleOpenInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.is_read) {
      updateInquiry(inquiry.id, { is_read: true });
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (currentFolder === 'TRASH') return inq.is_deleted;
    if (inq.is_deleted) return false;

    if (currentFolder === 'ARCHIVED') return inq.is_archived;
    if (inq.is_archived) return false;

    if (currentFolder === 'UNREAD') return !inq.is_read;
    return true; // INBOX
  });

  const getUnreadCount = () => inquiries.filter(i => !i.is_read && !i.is_archived && !i.is_deleted).length;

  const handleAddToSchedule = () => {
    // Open BookingDrawer but we ideally pass inquiry ID so it prepopulates. 
    // The current drawer doesn't accept "inquiryId to convert" via props directly unless we modify it,
    // but we can pass `null` as bookingId and append ?inquiry_id=xxx to URL.
    // Let's modify the drawer to take an `inquiryId` prop or URL param later if needed.
    // For now, we'll navigate to calendar with inquiry_id if we want, or just open a generic one.
    navigate(`/admin/schedule?inquiry=${selectedInquiry?.id}`);
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <h1>Inquiries</h1>
      </div>

      <div className={styles.layout}>
        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          <button 
            className={`${styles.folderBtn} ${currentFolder === 'INBOX' ? styles.activeFolder : ''}`}
            onClick={() => {setCurrentFolder('INBOX'); setSelectedInquiry(null);}}
          >
            <InboxIcon size={18} />
            Inbox
            {getUnreadCount() > 0 && <span className={styles.badge}>{getUnreadCount()}</span>}
          </button>
          
          <button 
            className={`${styles.folderBtn} ${currentFolder === 'UNREAD' ? styles.activeFolder : ''}`}
            onClick={() => {setCurrentFolder('UNREAD'); setSelectedInquiry(null);}}
          >
            <Mail size={18} />
            Unread
          </button>
          
          <button 
            className={`${styles.folderBtn} ${currentFolder === 'ARCHIVED' ? styles.activeFolder : ''}`}
            onClick={() => {setCurrentFolder('ARCHIVED'); setSelectedInquiry(null);}}
          >
            <Archive size={18} />
            Archived
          </button>
          
          <button 
            className={`${styles.folderBtn} ${currentFolder === 'TRASH' ? styles.activeFolder : ''}`}
            onClick={() => {setCurrentFolder('TRASH'); setSelectedInquiry(null);}}
          >
            <Trash2 size={18} />
            Trash
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className={styles.mainContent}>
          {selectedInquiry ? (
            /* MESSAGE VIEW */
            <div className={styles.messageView}>
              <div className={styles.messageToolbar}>
                <button className={styles.iconBtn} onClick={() => setSelectedInquiry(null)}>
                  <CornerUpLeft size={18} />
                  Back
                </button>
                <div className={styles.messageActions}>
                  <button className={styles.iconBtn} onClick={() => updateInquiry(selectedInquiry.id, { is_read: !selectedInquiry.is_read })}>
                    {selectedInquiry.is_read ? <Circle size={18} /> : <Mail size={18} />}
                  </button>
                  <button className={styles.iconBtn} onClick={() => updateInquiry(selectedInquiry.id, { is_archived: !selectedInquiry.is_archived })}>
                    <Archive size={18} />
                  </button>
                  <button className={styles.iconBtn} onClick={() => {
                    updateInquiry(selectedInquiry.id, { is_deleted: !selectedInquiry.is_deleted });
                    setSelectedInquiry(null);
                  }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className={styles.messageHeader}>
                <div className={styles.senderInfo}>
                  <h2>{selectedInquiry.client?.full_name || 'Unknown Client'}</h2>
                  <p>{selectedInquiry.client?.email || 'No email provided'}</p>
                </div>
                <div className={styles.messageMeta}>
                  <span>{format(new Date(selectedInquiry.created_at), 'MMM d, yyyy h:mm a')}</span>
                  <span className={`${styles.statusBadge} ${styles[selectedInquiry.status.toLowerCase()]}`}>
                    {selectedInquiry.status}
                  </span>
                </div>
              </div>

              <div className={styles.messageBody}>
                <div className={styles.eventSummary}>
                  <div className={styles.summaryItem}>
                    <strong>Event Type:</strong> {selectedInquiry.event_type}
                  </div>
                  <div className={styles.summaryItem}>
                    <strong>Preferred Date:</strong> {format(new Date(selectedInquiry.event_date), 'MMM d, yyyy')}
                  </div>
                  <div className={styles.summaryItem}>
                    <strong>Location:</strong> {selectedInquiry.location || 'Not specified'}
                  </div>
                  <div className={styles.summaryItem}>
                    <strong>Phone:</strong> {selectedInquiry.client?.phone || 'Not specified'}
                  </div>
                </div>

                <div className={styles.messageContent}>
                  <h3>Message / Requirements</h3>
                  <p>{selectedInquiry.project_notes || 'No additional message provided.'}</p>
                </div>

                {selectedInquiry.status !== 'CONFIRMED' && selectedInquiry.status !== 'COMPLETED' && (
                  <div className={styles.actionBanner}>
                    <button className={styles.scheduleBtn} onClick={handleAddToSchedule}>
                      <CalendarPlus size={20} />
                      ADD TO CALENDAR
                    </button>
                  </div>
                )}

                {selectedInquiry.status === 'CONFIRMED' && (
                  <div className={styles.successBanner}>
                    <CheckCircle2 size={20} />
                    Added to Schedule
                    <button className={styles.linkBtn} onClick={() => navigate('/admin/schedule')}>View Scheduled Event</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* LIST VIEW */
            <div className={styles.inquiryList}>
              {loading ? (
                <div className={styles.emptyState}>Loading inquiries...</div>
              ) : filteredInquiries.length === 0 ? (
                <div className={styles.emptyState}>No inquiries found in this folder.</div>
              ) : (
                filteredInquiries.map(inq => (
                  <div 
                    key={inq.id} 
                    className={`${styles.inquiryRow} ${!inq.is_read ? styles.unread : ''}`}
                    onClick={() => handleOpenInquiry(inq)}
                  >
                    <div className={styles.rowSender}>
                      {!inq.is_read && <div className={styles.unreadDot} />}
                      {inq.client?.full_name || 'Unknown'}
                    </div>
                    <div className={styles.rowSubject}>
                      <span className={styles.eventTypeBadge}>{inq.event_type}</span>
                      <span className={styles.rowPreview}>{inq.project_notes || 'No message...'}</span>
                    </div>
                    <div className={styles.rowDate}>
                      {format(new Date(inq.created_at), 'MMM d')}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
