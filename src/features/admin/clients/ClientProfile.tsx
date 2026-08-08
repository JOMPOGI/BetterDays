import { useState } from 'react';

import { Checkbox } from '../../../components/ui/Checkbox/Checkbox';
import { useToast } from '../../../components/ui/Toast/ToastContext';
import styles from './ClientProfile.module.css';
import { AddPaymentModal } from '../payments/AddPaymentModal';

export function ClientProfile() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { addToast } = useToast();
  
  const [pipelineState, setPipelineState] = useState<Record<string, boolean>>({
    Booking: true,
    Payment: true,
    Questionnaire: true,
    Consultation: false,
    Prenup: false,
    Wedding: false,
    Editing: false,
    Delivered: false
  });
  
  const togglePipeline = (key: string) => setPipelineState(prev => ({...prev, [key]: !prev[key]}));

  const scrollTo = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 className={styles.title} style={{ margin: 0 }}>Maria Garcia & James Lim</h1>
            <div>
              <span className={styles.eventTypeBadge}>Wedding + Prenup</span>
            </div>
          </div>
        </div>
        <button className={styles.editBtn} onClick={() => addToast('Editing profile is coming soon.', 'info')}>Edit Profile</button>
      </div>

      <div className={styles.navTabs}>
        <a href="#operations" className={styles.navTab} onClick={(e) => scrollTo('operations', e)}>Operations</a>
        <a href="#financials" className={styles.navTab} onClick={(e) => scrollTo('financials', e)}>Financials</a>
        <a href="#details" className={styles.navTab} onClick={(e) => scrollTo('details', e)}>Client Details</a>
      </div>

      <div className={styles.unifiedDashboard}>
        
        {/* SECTION 1: Operations */}
        <section id="operations" className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Operations & Schedule</h2>
          <div className={styles.dashboardRow}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Production Pipeline</h2>
              <div className={styles.checklist}>
                {Object.entries(pipelineState).map(([key, value]) => (
                  <Checkbox key={key} checked={value} onChange={() => togglePipeline(key)} label={key} />
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Events Schedule</h2>
              <div className={styles.eventsList}>
                <div className={styles.eventCard}>
                  <h4>Initial Consultation</h4>
                  <p><strong>Date:</strong> Aug 15, 2026</p>
                  <p><strong>Type:</strong> Online (Zoom)</p>
                  <p><strong>Time:</strong> 2:00 PM</p>
                </div>
                <div className={styles.eventCard}>
                  <h4>Prenup Session</h4>
                  <p><strong>Date:</strong> Sep 20, 2026</p>
                  <p><strong>Location:</strong> Rizal Park</p>
                  <p><strong>Call Time:</strong> 8:00 AM</p>
                </div>
                <div className={styles.eventCard}>
                  <h4>Wedding Day</h4>
                  <p><strong>Date:</strong> Oct 15, 2026</p>
                  <p><strong>Preparation:</strong> Manila Hotel</p>
                  <p><strong>Ceremony:</strong> Manila Cathedral</p>
                  <p><strong>Reception:</strong> The Blue Leaf</p>
                  <p><strong>Call Time:</strong> 6:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Financials */}
        <section id="financials" className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Financials & Scope</h2>
          <div className={styles.dashboardRow}>
            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className={styles.cardTitle} style={{ margin: 0 }}>Financial Ledger</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className={styles.editBtn} onClick={() => addToast('Payment reminder sent successfully.', 'success')}>Remind Payment</button>
                  <button className={styles.recordBtn} onClick={() => setIsPaymentModalOpen(true)}>Record Payment</button>
                </div>
              </div>
              
              <div className={styles.metricsRow} style={{ marginBottom: '2rem' }}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Event Date</span>
                  <span className={styles.metricValue}>Oct 15, 2026</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Package Worth</span>
                  <span className={styles.metricValue}>₱150,000.00</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Paid DP</span>
                  <span className={styles.metricValue}>₱65,000.00</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Outstanding Balance</span>
                  <span className={styles.metricValueGold}>₱85,000.00</span>
                </div>
              </div>

              <table className={styles.paymentTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th className={styles.rightAlign}>Amount Paid</th>
                    <th className={styles.rightAlign}>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Jul 1, 2026</td>
                    <td>Downpayment</td>
                    <td className={styles.rightAlign}>₱65,000.00</td>
                    <td className={styles.rightAlign}>₱85,000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Booking & Inclusions</h2>
              <div className={styles.bookingBox}>
                <p><strong>Selected Package:</strong> Wedding Premium (₱150,000.00)</p>
                <p><strong>Inclusions:</strong></p>
                <ul className={styles.inclusionList}>
                  <li>Full Day Coverage</li>
                  <li>2 Photographers, 3 Videographers</li>
                  <li>Same Day Edit (SDE)</li>
                  <li>Prenup Session</li>
                  <li>Premium Album</li>
                </ul>
                <p><strong>Contract Status:</strong> Signed on July 1, 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Client Details */}
        <section id="details" className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Client Details & Vision</h2>
          <div className={styles.dashboardRow}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Client Contact</h2>
              <div className={styles.contactGrid}>
                <div className={styles.contactBox}>
                  <h3>Bride</h3>
                  <p><strong>Name:</strong> Maria Garcia</p>
                  <p><strong>Email:</strong> maria@example.com</p>
                  <p><strong>Phone:</strong> +63 917 123 4567</p>
                  <p><strong>IG:</strong> @mariagarcia</p>
                </div>
                <div className={styles.contactBox}>
                  <h3>Groom</h3>
                  <p><strong>Name:</strong> James Lim</p>
                  <p><strong>Email:</strong> james@example.com</p>
                  <p><strong>Phone:</strong> +63 918 765 4321</p>
                  <p><strong>IG:</strong> @jameslim</p>
                </div>
              </div>
            </div>
            
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Internal Notes</h2>
              <textarea className={styles.notesArea} defaultValue="Maria requested we don't shoot from her left side. James's dad is arriving late, so adjust family portraits to reception." />
              <button className={styles.recordBtn} onClick={() => addToast('Internal notes saved.', 'success')}>Save Notes</button>
            </div>
          </div>

          <div className={styles.dashboardRow} style={{ gridTemplateColumns: '1fr' }}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Creative Vision (Questionnaire)</h2>
              <div className={styles.qnaList}>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: Describe your ideal video. (Check all that apply.)</p>
                  <p className={styles.answer}>A: Candid / Chill, Cinematic / Epic, Feel Good / Fun, MEANINGFUL, CAPTURES THE SENTIMENTAL MOMENTS</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: Any samples / pegs you want to show?</p>
                  <p className={styles.answer}>A: Yes, sent 3 video links via email last week.</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: What are your must-not-miss shots?</p>
                  <p className={styles.answer}>A: Walking down the aisle, Look of the groom, Vows, Silly and fun moments.</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: How long have you been together?</p>
                  <p className={styles.answer}>A: 7 years.</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: Tell us about the spark. How did you meet? When? Where? What was it like?</p>
                  <p className={styles.answer}>A: We met in college during a group project in 2019. It was awkward at first, but we instantly bonded over our mutual stress for the subject.</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: What did you like about each other then?</p>
                  <p className={styles.answer}>A: James was very organized. Maria was very creative.</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: What do you enjoy doing together? What is a usual date for you?</p>
                  <p className={styles.answer}>A: We love trying new coffee shops and going on long drives with no destination. A usual date is just ordering takeout and watching movies.</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: Any unforgettable moments you'd like to share?</p>
                  <p className={styles.answer}>A: Our trip to Japan when we got lost in Kyoto and missed our train.</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: Any sentimental items or things during the course of your relationship?</p>
                  <p className={styles.answer}>A: A film camera we bought together during our first year.</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: What do you hate or dislike about each other?</p>
                  <p className={styles.answer}>A: James takes too long to get ready. Maria can never decide where to eat.</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: Tell us about your engagement.</p>
                  <p className={styles.answer}>A: It happened at sunset on a beach in Siargao. Very private and intimate, just the two of us.</p>
                </div>
                <div className={styles.qnaItem}>
                  <p className={styles.question}>Q: What do you love about each other now? Basically, why are you marrying this person?</p>
                  <p className={styles.answer}>A: Because we balance each other out perfectly. We are home to each other.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      <AddPaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        projectName="Garcia & Lim - Wedding Premium" 
      />
    </div>
  );
}
