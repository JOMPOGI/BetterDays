import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBooking } from '@/app/providers/BookingContext';
import { downloadElementAsPDF } from '@/utils/pdfExport';
import { formatDateOnly } from '@/utils/date';
import type { PackageType } from '@/app/providers/BookingContext';
import { Questionnaire } from '@/features/questionnaire/Questionnaire';
import { Video, Camera, Heart, Check, Phone, MessageSquare, Mail, MessageCircle, Download } from 'lucide-react';
import styles from './BookingWizard.module.css';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isBefore, startOfDay } from 'date-fns';

type PackageDef = { id: PackageType; name: string; price: number; description: string; icon: React.ReactNode };

const PACKAGES: PackageDef[] = [
  { id: 'wedding', name: 'Wedding Film', price: 85000, description: 'Full-day cinematic coverage from intimate preparation moments through your first dance as husband and wife.', icon: <Video size={20} /> },
  { id: 'prenup', name: 'Prenup Film', price: 45000, description: 'A short film capturing your love story before the big day — golden-hour light, styled scenes, and candid joy.', icon: <Camera size={20} /> },
  { id: 'wedding_prenup', name: 'Wedding + Prenup', price: 120000, description: 'The complete Better Days experience. Two cinematic films, one love story, at our exclusive bundled rate.', icon: <Heart size={20} /> },
];

export function BookingWizard() {
  const { state, setPackage, setDate, setPrenupDate, setQuotation, setClientDetails, setPaymentReference } = useBooking();
  const [step, setStep] = useState(1);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  
  // Local state
  const [contactMethod, setContactMethod] = useState('Email');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [selectingDateFor, setSelectingDateFor] = useState<'wedding' | 'prenup'>('wedding');
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [availability, setAvailability] = useState<Record<string, 'BOOKED' | 'PENDING'>>({});
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  
  // Client info state
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ig, setIg] = useState('');
  const [fb, setFb] = useState('');
  
  const [weddingLoc, setWeddingLoc] = useState('');
  const [prenupLoc, setPrenupLoc] = useState('');
  const [primaryLoc, setPrimaryLoc] = useState('');
  const [addLoc, setAddLoc] = useState('');

  const [paymentLoading, setPaymentLoading] = useState(false);
  const isSubmittingRef = useRef(false); // synchronous guard — closes the gap where a fast double-click fires before React re-renders the disabled button
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [checkingReturn, setCheckingReturn] = useState(true);

  // If the customer is being redirected back from Xendit's checkout page,
  // poll the booking status for a few seconds — the webhook usually lands
  // within a second or two of the redirect firing.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returningBookingId = params.get('xendit_ref');
    if (!returningBookingId) {
      setCheckingReturn(false);
      return;
    }

    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      const { data } = await supabase.rpc('get_booking_status', { p_booking_id: returningBookingId });
      if (data === 'CONFIRMED') {
        setPaymentReference(returningBookingId);
        setShowQuestionnaire(true);
        setCheckingReturn(false);
      } else if (attempts >= 8) {
        setCheckingReturn(false);
        setPaymentError('Your payment is still processing. If GCash/your bank confirmed the charge, refresh this page in a minute — it usually finishes within a minute.');
      } else {
        setTimeout(poll, 2000);
      }
    };
    poll();
  }, []);

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  useEffect(() => {
    if (step !== 2) return;
    let cancelled = false;

    const loadAvailability = async () => {
      setAvailabilityLoading(true);
      const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      const { data, error } = await supabase.rpc('get_public_availability', {
        req_start_date: startDate,
        req_end_date: endDate,
      });

      if (cancelled) return;
      if (error) {
        console.error('Error fetching public availability:', error);
        setAvailability({});
      } else {
        const next: Record<string, 'BOOKED' | 'PENDING'> = {};
        (data || []).forEach((row: any) => {
          if (row.event_date && (row.status === 'CONFIRMED' || row.status === 'COMPLETED')) {
            next[row.event_date] = 'BOOKED';
          } else if (row.event_date && row.status === 'PENDING' && next[row.event_date] !== 'BOOKED') {
            next[row.event_date] = 'PENDING';
          }
        });
        setAvailability(next);
      }
      setAvailabilityLoading(false);
    };

    loadAvailability();
    return () => { cancelled = true; };
  }, [currentMonth, step]);

  const moveMonth = (amount: number) => {
    setCurrentMonth(prev => amount > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const handlePackageSelect = (pkgId: PackageType, price: number) => {
    setPackage(pkgId);
    setQuotation(price, price * 0.3); // 30% downpayment
  };

  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const locs = state.selectedPackage === 'wedding_prenup' 
      ? [`Wedding: ${weddingLoc}`, `Prenup: ${prenupLoc}`]
      : [primaryLoc, addLoc].filter(Boolean);

    setClientDetails({
      firstName: brideName,
      lastName: groomName,
      email: email,
      phone: phone,
      locations: locs,
      notes: `Contact via ${contactMethod}. IG: ${ig}, FB: ${fb}`,
    });
    nextStep();
  };

  const handlePayment = async () => {
    if (!state.selectedPackage || !state.eventDate || !state.quotation) return;
    if (isSubmittingRef.current) return; // already processing this exact click — ignore repeats
    isSubmittingRef.current = true;

    setPaymentError(null);
    setPaymentLoading(true);

    const fullName = `${brideName} & ${groomName}`.trim();
    const weddingDate = formatDateOnly(state.eventDate);
    const prenupDate = state.prenupDate ? formatDateOnly(state.prenupDate) : null;
    const isCombo = state.selectedPackage === 'wedding_prenup';

    try {
      // 1. Create the booking as PENDING_PAYMENT — no fake payment inserted here anymore.
      const { data, error } = await supabase.rpc('create_public_booking', {
        p_name: fullName,
        p_email: email,
        p_phone: phone,
        p_package_type: state.selectedPackage,
        p_event_date: state.selectedPackage === 'prenup' ? (prenupDate || weddingDate) : weddingDate,
        p_prenup_date: isCombo ? prenupDate : null,
        p_location: isCombo ? weddingLoc : (primaryLoc || prenupLoc),
        p_prenup_location: isCombo ? prenupLoc : (state.selectedPackage === 'prenup' ? primaryLoc : null),
        p_package_total: state.quotation.total,
        p_reservation_amount: state.quotation.reservation,
        p_balance: state.quotation.balance,
        p_notes: state.clientDetails.notes,
      });

      if (error) throw error;
      if (!data || !data[0]) throw new Error('Booking was not saved.');
      const { booking_id: bookingId } = data[0];

      try {
        // 2. Ask our Edge Function to create the real Xendit checkout page
        const returnBase = window.location.origin + window.location.pathname;
        const { data: invoice, error: invoiceError } = await supabase.functions.invoke('create-xendit-invoice', {
          body: {
            bookingId,
            amount: state.quotation.reservation,
            email,
            description: `${fullName} — ${state.selectedPackage.replace('_', ' + ')} downpayment`,
            successUrl: `${returnBase}?xendit_ref=${bookingId}`,
            failureUrl: `${returnBase}?xendit_ref=${bookingId}`,
          },
        });
        if (invoiceError) throw invoiceError;
        if (!invoice?.invoice_url) throw new Error('Could not start checkout.');

        // 3. Send the customer to Xendit's hosted checkout page. They'll pick
        // card, GCash, Maya, etc. there — actual "paid" confirmation comes
        // back through the webhook, not this redirect.
        window.location.href = invoice.invoice_url;
      } catch (invoiceStepError) {
        // The booking was already saved, but checkout couldn't start — clean
        // it up immediately rather than leaving an unpayable orphan record
        // sitting in the database.
        await supabase.rpc('cancel_pending_booking', { p_booking_id: bookingId });
        throw invoiceStepError;
      }
    } catch (error: any) {
      console.error('Booking submission failed:', error);
      setPaymentError(error?.message || 'Unable to start checkout. Please try again.');
      setPaymentLoading(false);
      isSubmittingRef.current = false;
    }
  };

  if (checkingReturn) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Confirming your payment…</div>;
  }

  if (showQuestionnaire) {
    return <Questionnaire onBack={() => setShowQuestionnaire(false)} />;
  }

  const selectedPkgData = PACKAGES.find(p => p.id === state.selectedPackage);
  const isCombo = state.selectedPackage === 'wedding_prenup';

  const canProceedDate = isCombo 
    ? (state.eventDate !== null && state.prenupDate !== null)
    : (state.eventDate !== null);

  return (
    <div id="booking" className={styles.wizardContainer}>
      <main className={styles.main}>
        <div className={styles.wizardContent}>
          {step > 1 && (
            <button className={styles.globalBackBtn} onClick={prevStep}>
              &larr; Back
            </button>
          )}
          
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2>Choose Your Service</h2>
              <p className={styles.stepDesc}>Select the package that best fits your vision.</p>
              
              <div className={styles.packageGrid}>
                {PACKAGES.map(pkg => {
                  const isSelected = state.selectedPackage === pkg.id;
                  return (
                    <div 
                      key={pkg.id || 'none'} 
                      className={`${styles.packageCard} ${isSelected ? styles.selected : ''}`} 
                      onClick={() => handlePackageSelect(pkg.id, pkg.price)}
                    >
                      <div className={styles.packageIcon}>{pkg.icon}</div>
                      <div className={styles.packageInfo}>
                        <div className={styles.packageHeader}>
                          <div className={styles.packageTitleRow}>
                            <h3>{pkg.name}</h3>
                          </div>
                          <div className={styles.price}>₱{pkg.price.toLocaleString()}</div>
                        </div>
                        <p className={styles.packageDesc}>{pkg.description}</p>
                        {isSelected && (
                          <div className={styles.selectedMark}>
                            <Check size={16} /> Selected
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={nextStep} disabled={!state.selectedPackage}>
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent}>
              <h2>Select Your Date{isCombo ? 's' : ''}</h2>
              <p className={styles.stepDesc}>Choose your preferred event date from the calendar below.</p>
              
              {isCombo && (
                <div className={styles.dateTabContainer}>
                  <button 
                    onClick={() => setSelectingDateFor('wedding')}
                    className={`${styles.actionBtn} ${selectingDateFor === 'wedding' ? '' : styles.inactiveTab}`}
                    style={{ flex: 1, justifyContent: 'center', background: selectingDateFor === 'wedding' ? 'var(--book-text)' : 'transparent', color: selectingDateFor === 'wedding' ? 'var(--book-bg)' : 'var(--book-text)' }}
                  >
                    Wedding Date {state.eventDate && '✓'}
                  </button>
                  <button 
                    onClick={() => setSelectingDateFor('prenup')}
                    className={`${styles.actionBtn} ${selectingDateFor === 'prenup' ? '' : styles.inactiveTab}`}
                    style={{ flex: 1, justifyContent: 'center', background: selectingDateFor === 'prenup' ? 'var(--book-text)' : 'transparent', color: selectingDateFor === 'prenup' ? 'var(--book-bg)' : 'var(--book-text)' }}
                  >
                    Prenup Date {state.prenupDate && '✓'}
                  </button>
                </div>
              )}

              <div className={styles.calendarContainer}>
                <div className={styles.calendarHeader}>
                  <button type="button" className={styles.calNav} onClick={() => moveMonth(-1)} aria-label="Previous month">&lt;</button>
                  <span>{format(currentMonth, 'MMMM yyyy')}</span>
                  <button type="button" className={styles.calNav} onClick={() => moveMonth(1)} aria-label="Next month">&gt;</button>
                </div>

                <div className={styles.calendarGrid}>
                  {['S','M','T','W','T','F','S'].map((day, i) => <div key={i} className={styles.calDayHeader}>{day}</div>)}
                  {(() => {
                    const monthStart = startOfMonth(currentMonth);
                    const monthEnd = endOfMonth(currentMonth);
                    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
                    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
                    const cells = [];
                    let day = gridStart;
                    const today = startOfDay(new Date());
                    while (day <= gridEnd) {
                      const date = day;
                      const dateString = format(date, 'yyyy-MM-dd');
                      const status = availability[dateString];
                      const isPast = isBefore(date, today);
                      const outsideMonth = !isSameMonth(date, monthStart);
                      const disabled = isPast || !!status || outsideMonth;
                      const activeDate = isCombo ? (selectingDateFor === 'wedding' ? state.eventDate : state.prenupDate) : state.eventDate;
                      const selected = activeDate ? isSameDay(date, activeDate) : false;

                      cells.push(
                        <div
                          key={dateString}
                          className={`${styles.calCell}${outsideMonth ? ` ${styles.disabled}` : ''}${disabled ? ` ${styles.disabled}` : ''}${selected ? ` ${styles.selected}` : ''}`}
                          onClick={() => {
                            if (disabled) return;
                            if (isCombo) {
                              if (selectingDateFor === 'wedding') {
                                setDate(date);
                                setSelectingDateFor('prenup');
                              } else {
                                setPrenupDate(date);
                              }
                            } else {
                              setDate(date);
                            }
                          }}
                          title={status ? status.toLowerCase() : undefined}
                        >
                          {format(date, 'd')}
                          {status === 'PENDING' && !disabled && <span aria-label="Pending">•</span>}
                        </div>
                      );
                      day = addDays(day, 1);
                    }
                    return cells;
                  })()}
                </div>

                {availabilityLoading && <div style={{ marginTop: 8, fontSize: 12, opacity: 0.65 }}>Checking availability…</div>}

                <div className={styles.calLegend}>
                  <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.selected}`}></div> Selected</div>
                  <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.available}`}></div> Available</div>
                </div>
              </div>

              {((!isCombo && state.eventDate) || (isCombo && state.eventDate && state.prenupDate)) && (
                <div className={styles.dateSummaryPill}>
                  <div className={styles.dateCheck}><Check size={14} /></div>
                  <div className={styles.dateDetails}>
                    {!isCombo && (
                      <>
                        <span>{selectedPkgData?.name.split(' ')[0].toUpperCase()} DATE</span>
                        <strong>{state.eventDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                      </>
                    )}
                    {isCombo && (
                      <>
                        <span>SELECTED DATES</span>
                        <strong>Wedding: {state.eventDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                        <strong style={{display: 'block', marginTop: '4px'}}>Prenup: {state.prenupDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={nextStep} disabled={!canProceedDate}>
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContent}>
              <h2>About the Couple</h2>
              <p className={styles.stepDesc}>We would love to know who we will be filming.</p>
              
              <form id="coupleForm" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Bride's Name</label>
                    <input className={styles.input} type="text" placeholder="Maria" required value={brideName} onChange={e => setBrideName(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Groom's Name</label>
                    <input className={styles.input} type="text" placeholder="Juan" required value={groomName} onChange={e => setGroomName(e.target.value)} />
                  </div>
                  <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Contact Number</label>
                    <input className={styles.input} type="tel" placeholder="+63 9XX XXX XXXX" required value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Email Address</label>
                    <input className={styles.input} type="email" placeholder="hello@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Instagram <span>optional</span></label>
                    <input className={styles.input} type="text" placeholder="@handle" value={ig} onChange={e => setIg(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Facebook <span>optional</span></label>
                    <input className={styles.input} type="text" placeholder="Your name" value={fb} onChange={e => setFb(e.target.value)} />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                  <label>Preferred Contact Method</label>
                  <div className={styles.contactMethodGrid}>
                    {[
                      { id: 'Call', icon: <Phone size={20} /> },
                      { id: 'SMS', icon: <MessageSquare size={20} /> },
                      { id: 'Email', icon: <Mail size={20} /> },
                      { id: 'WhatsApp', icon: <MessageCircle size={20} /> }
                    ].map(method => (
                      <div 
                        key={method.id} 
                        className={`${styles.contactMethodCard} ${contactMethod === method.id ? styles.selected : ''}`}
                        onClick={() => setContactMethod(method.id)}
                      >
                        <div className={styles.contactIcon}>{method.icon}</div>
                        <div className={styles.contactLabel}>{method.id}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.actions}>
                  <button type="submit" form="coupleForm" className={styles.actionBtn}>
                    Continue &rarr;
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 4 && (
            <div className={styles.stepContent}>
              <h2>Event Locations</h2>
              <p className={styles.stepDesc}>Help us understand the canvas for your film.</p>
              
              <form id="locForm" onSubmit={submitDetails}>
                <div className={styles.formGrid}>
                  {isCombo ? (
                    <>
                      <div className={`${styles.formGroup} ${styles.full}`}>
                        <label>Wedding Location</label>
                        <input className={styles.input} type="text" placeholder="e.g. San Agustin Church, Manila" required value={weddingLoc} onChange={e => setWeddingLoc(e.target.value)} />
                      </div>
                      <div className={`${styles.formGroup} ${styles.full}`}>
                        <label>Prenup Location</label>
                        <input className={styles.input} type="text" placeholder="e.g. Pinto Art Museum" required value={prenupLoc} onChange={e => setPrenupLoc(e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`${styles.formGroup} ${styles.full}`}>
                        <label>Primary Shoot Location</label>
                        <input className={styles.input} type="text" placeholder="e.g. El Nido, Palawan" required value={primaryLoc} onChange={e => setPrimaryLoc(e.target.value)} />
                      </div>
                      <div className={`${styles.formGroup} ${styles.full}`}>
                        <label>Additional Locations <span>optional</span></label>
                        <input className={styles.input} type="text" placeholder="e.g. second venue, sunrise spot" value={addLoc} onChange={e => setAddLoc(e.target.value)} />
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.actions}>
                  <button type="button" className={styles.backBtn} onClick={prevStep}>&lt; Back</button>
                  <button type="submit" form="locForm" className={styles.actionBtn}>
                    Continue &rarr;
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 5 && (
            <div className={styles.stepContent}>
              <div id="quotation-content" style={{ padding: '20px', margin: '-20px', background: 'transparent' }}>
                <h2>Estimated Quotation</h2>
                <p className={styles.stepDesc}>Review your booking before proceeding to payment.</p>
                
                <div className={styles.darkQuoteCard}>
                  <div className={styles.quoteTop}>
                  <div className={styles.quoteTopLeft}>
                    <span>Package</span>
                    <h3>{selectedPkgData?.name}</h3>
                    <p>Better Days Studios</p>
                  </div>
                  <div className={styles.quoteTopRight}>
                    <h3>₱{state.quotation?.total.toLocaleString()}</h3>
                    <p>Total Package Rate</p>
                  </div>
                </div>
                <div className={styles.quoteDivider}></div>
                <div className={styles.quoteRow}>
                  <span>Downpayment Required (30%)</span>
                  <strong>₱{state.quotation?.reservation.toLocaleString()}</strong>
                </div>
                <div className={`${styles.quoteRow} ${styles.balance}`}>
                  <span>Balance on Event Day</span>
                  <strong>₱{state.quotation?.balance.toLocaleString()}</strong>
                </div>
              </div>

              <div className={styles.lightSummary}>
                <span className={styles.summaryLabel}>Booking Summary</span>
                <div className={styles.summaryRow}>
                  <span>Couple</span>
                  <span>{brideName} &amp; {groomName}</span>
                </div>
                
                {isCombo ? (
                  <>
                    <div className={styles.summaryRow}>
                      <span>Wedding Date</span>
                      <span>{state.eventDate?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Prenup Date</span>
                      <span>{state.prenupDate?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.summaryRow}>
                    <span>{selectedPkgData?.name.split(' ')[0]} Date</span>
                    <span>{state.eventDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}
                
                <div className={styles.summaryRow} style={{flexDirection: 'column', alignItems: 'stretch', gap: '8px', paddingTop: '8px'}}>
                  <span style={{marginBottom: 0}}>Locations</span>
                  {state.clientDetails.locations.map((loc, i) => (
                    <span key={i} style={{textAlign: 'right'}}>{loc}</span>
                  ))}
                </div>
                
                <div className={styles.summaryRow} style={{marginTop: '16px'}}>
                  <span>Contact</span>
                  <span>{email}</span>
                </div>
                </div>
              </div>

              <label className={styles.termsCheckbox}>
                <input type="checkbox" checked={termsAgreed} onChange={e => setTermsAgreed(e.target.checked)} />
                <div className={styles.customCheck}>{termsAgreed && <Check size={16} />}</div>
                <div>
                  I agree to the <a href="#">Terms &amp; Conditions</a> and acknowledge that the 30% downpayment is required to confirm my booking and is non-refundable.
                </div>
              </label>

              <div className={styles.actions} style={{ flexWrap: 'wrap', gap: '12px' }}>
                <button 
                  className={styles.backBtn} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }} 
                  onClick={() => downloadElementAsPDF('quotation-content', 'BetterDays-Quotation')}
                >
                  <Download size={16} /> Save as PDF
                </button>
                <button className={styles.actionBtn} onClick={nextStep} disabled={!termsAgreed} style={{ flex: 1 }}>
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className={styles.stepContent}>
              <h2>Secure Payment</h2>
              <p className={styles.stepDesc}>Downpayment: ₱{state.quotation?.reservation.toLocaleString()} — via Xendit</p>
              
              <div className={styles.paymentGrid}>
                <div className={`${styles.payOption} ${styles.gcash} ${paymentMethod === 'gcash' ? styles.selected : ''}`} onClick={() => setPaymentMethod('gcash')}>
                  <h4>GCash</h4>
                  <p>Mobile wallet</p>
                </div>
                <div className={`${styles.payOption} ${styles.maya} ${paymentMethod === 'maya' ? styles.selected : ''}`} onClick={() => setPaymentMethod('maya')}>
                  <h4>Maya</h4>
                  <p>Mobile wallet</p>
                </div>
                <div className={`${styles.payOption} ${styles.card} ${paymentMethod === 'card' ? styles.selected : ''}`} onClick={() => setPaymentMethod('card')}>
                  <h4>Credit / Debit</h4>
                  <p>Visa, Mastercard</p>
                </div>
                <div className={`${styles.payOption} ${styles.bank} ${paymentMethod === 'bank' ? styles.selected : ''}`} onClick={() => setPaymentMethod('bank')}>
                  <h4>Online Banking</h4>
                  <p>BDO, BPI, etc.</p>
                </div>
              </div>

              {paymentMethod === 'gcash' && (
                <div className={styles.formGroup}>
                  <label>GCash Mobile Number</label>
                  <input className={styles.input} type="tel" placeholder="09XX XXX XXXX" />
                  <div className={styles.payNotice}>A payment request will be sent to this number.</div>
                </div>
              )}
              {paymentMethod === 'maya' && (
                <div className={styles.formGroup}>
                  <label>Maya Mobile Number</label>
                  <input className={styles.input} type="tel" placeholder="09XX XXX XXXX" />
                  <div className={styles.payNotice}>A payment request will be sent via Maya.</div>
                </div>
              )}
              {paymentMethod === 'card' && (
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Card Number</label>
                    <input className={styles.input} type="text" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Cardholder Name</label>
                    <input className={styles.input} type="text" placeholder="As it appears on your card" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Expiry</label>
                    <input className={styles.input} type="text" placeholder="MM / YY" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>CVV</label>
                    <input className={styles.input} type="password" placeholder="•••" />
                  </div>
                </div>
              )}
              {paymentMethod === 'bank' && (
                <div className={styles.formGroup}>
                  <label>Select Your Bank</label>
                  <select className={styles.input} style={{background: '#111'}}>
                    <option>Choose bank...</option>
                    <option>BDO</option>
                    <option>BPI</option>
                    <option>UnionBank</option>
                  </select>
                </div>
              )}

              <div className={styles.sslBadge}>
                <div className={styles.sslDot}></div>
                Powered by Xendit · 256-bit SSL encryption · PCI DSS compliant
              </div>

              {paymentError && <div className={styles.error}>{paymentError}</div>}

              <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={handlePayment} disabled={!paymentMethod || paymentLoading}>
                  {paymentLoading ? 'Redirecting to checkout…' : `Pay ₱${state.quotation?.reservation.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
