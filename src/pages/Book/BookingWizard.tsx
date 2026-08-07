import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import type { PackageType } from '../../context/BookingContext';
import { Questionnaire } from './Questionnaire';
import styles from './BookingWizard.module.css';

const PACKAGES = [
  { id: 'wedding', name: 'Wedding Film', price: 150000, description: 'Complete wedding day coverage.' },
  { id: 'prenup', name: 'Prenup Film', price: 50000, description: 'Pre-wedding cinematic short.' },
  { id: 'wedding_photo', name: 'Wedding Film + Photo', price: 200000, description: 'Includes partner photography studio.' },
  { id: 'prenup_photo', name: 'Prenup Film + Photo', price: 80000, description: 'Includes partner photography studio.' },
];

export function BookingWizard() {
  const navigate = useNavigate();
  const { state, setPackage, setDate, setQuotation, setClientDetails, setPaymentReference } = useBooking();
  const [step, setStep] = useState(1);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handlePackageSelect = (pkgId: PackageType, price: number) => {
    setPackage(pkgId);
    setQuotation(price, price * 0.2); // 20% downpayment
    nextStep();
  };

  if (showQuestionnaire) {
    return (
      <div id="booking">
        <Questionnaire onBack={() => setShowQuestionnaire(false)} />
      </div>
    );
  }

  return (
    <div id="booking" className={styles.wizardContainer}>
      <main className={styles.main}>
        <div className={styles.wizardContent}>
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2>Select a Package</h2>
            <div className={styles.packageGrid}>
              {PACKAGES.map(pkg => (
                <div key={pkg.id} className={`${styles.packageCard} ${state.selectedPackage === pkg.id ? styles.selected : ''}`} onClick={() => handlePackageSelect(pkg.id as PackageType, pkg.price)}>
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  <div className={styles.price}>Starts at ₱{pkg.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContent}>
            <h2>Choose Your Date</h2>
            <div className={styles.calendarContainer}>
              <div className={styles.calendarHeader}>
                <span>August 2026</span>
                <div>
                  <button className={styles.calNav}>&lt;</button>
                  <button className={styles.calNav}>&gt;</button>
                </div>
              </div>
              <div className={styles.calendarGrid}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => <div key={day} className={styles.calDayHeader}>{day}</div>)}
                {Array.from({length: 31}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`${styles.calCell} ${state.eventDate?.getDate() === i+1 ? styles.calSelected : ''}`}
                    onClick={() => setDate(new Date(2026, 7, i+1))}
                  >
                    {i+1}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.backBtn} onClick={prevStep}>Back</button>
              <button className={styles.actionBtn} onClick={nextStep} disabled={!state.eventDate}>Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContent}>
            <h2>Instant Quotation</h2>
            <div className={styles.quotation}>
              <div className={styles.qRow}><span>Total Price:</span> <span>₱{state.quotation?.total.toLocaleString()}</span></div>
              <div className={styles.qRow}><span>Reservation (20%):</span> <span>₱{state.quotation?.reservation.toLocaleString()}</span></div>
              <div className={styles.qRow}><span>Remaining Balance:</span> <span>₱{state.quotation?.balance.toLocaleString()}</span></div>
            </div>
            <div className={styles.actions}>
              <button className={styles.backBtn} onClick={prevStep}>Back</button>
              <button className={styles.actionBtn} onClick={nextStep}>Continue Booking</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={styles.stepContent}>
            <h2>Booking Details</h2>
            <form className={styles.form} onSubmit={e => { e.preventDefault(); nextStep(); }}>
              <input type="text" placeholder="First Name" required onChange={e => setClientDetails({ firstName: e.target.value })} />
              <input type="text" placeholder="Last Name" required onChange={e => setClientDetails({ lastName: e.target.value })} />
              <input type="email" placeholder="Email" required onChange={e => setClientDetails({ email: e.target.value })} />
              <input type="tel" placeholder="Phone Number" required onChange={e => setClientDetails({ phone: e.target.value })} />
              <textarea placeholder="Locations (e.g. Prep, Ceremony, Reception)" required onChange={e => setClientDetails({ locations: [e.target.value] })} />
              <div className={styles.actions}>
                <button type="button" className={styles.backBtn} onClick={prevStep}>Back</button>
                <button type="submit" className={styles.actionBtn}>Proceed to Payment</button>
              </div>
            </form>
          </div>
        )}

        {step === 5 && (
          <div className={styles.stepContent}>
            <h2>Reservation Payment</h2>
            <p className={styles.paymentDesc}>Select a secure payment method to reserve your date.</p>
            <div className={styles.paymentMethods}>
              <button className={styles.payBtn} onClick={() => { setPaymentReference('PM-GCSH-' + Math.floor(Math.random()*1000000)); nextStep(); }}>
                <span className={styles.payIcon}>GC</span> GCash
              </button>
              <button className={styles.payBtn} onClick={() => { setPaymentReference('PM-CARD-' + Math.floor(Math.random()*1000000)); nextStep(); }}>
                <span className={styles.payIcon}>💳</span> Credit / Debit Card
              </button>
              <button className={styles.payBtn} onClick={() => { setPaymentReference('PM-MYA-' + Math.floor(Math.random()*1000000)); nextStep(); }}>
                <span className={styles.payIcon}>M</span> Maya
              </button>
            </div>
            <div className={styles.actions}>
              <button className={styles.backBtn} onClick={prevStep}>Back</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className={styles.stepContent}>
            <h2>Booking Confirmed!</h2>
            <p>Your reservation is secured. Reference: <strong>{state.paymentReference}</strong></p>
            <button className={styles.actionBtn} onClick={() => setShowQuestionnaire(true)}>Start Creative Vision Questionnaire</button>
          </div>
        )}
        </div>

        {step > 1 && step < 6 && (
          <aside className={styles.orderSummary}>
            <h3>Your Booking</h3>
            {state.selectedPackage && (
              <div className={styles.summaryItem}>
                <span className={styles.sLabel}>Package</span>
                <span className={styles.sValue}>{PACKAGES.find(p => p.id === state.selectedPackage)?.name}</span>
              </div>
            )}
            {state.eventDate && (
              <div className={styles.summaryItem}>
                <span className={styles.sLabel}>Date</span>
                <span className={styles.sValue}>{state.eventDate.toLocaleDateString()}</span>
              </div>
            )}
            {state.quotation && (
              <div className={styles.summaryItem}>
                <span className={styles.sLabel}>Total</span>
                <span className={styles.sValue}>₱{state.quotation.total.toLocaleString()}</span>
              </div>
            )}
          </aside>
        )}
      </main>
    </div>
  );
}
