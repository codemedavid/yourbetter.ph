import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import doctors from '../data/doctors';
import { Calendar, Clock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function BookMD() {
    const navigate = useNavigate();
    const { state, dispatch } = useAssessment();
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const doc = doctors.find(d => d.id === selectedDoc);
    const dateSlots = doc?.availableSlots.find(s => s.date === selectedDate);

    const handleBook = () => {
        dispatch({
            type: 'BOOK_MD',
            payload: {
                doctorId: selectedDoc,
                doctorName: doc.name,
                date: selectedDate,
                time: selectedTime,
            },
        });
        navigate('/thank-you');
    };

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="badge badge-teal animate-fadeInUp" style={{ marginBottom: '16px' }}>
                        <Calendar size={12} style={{ marginRight: '4px' }} /> Step 4 of 5
                    </div>
                    <h1 className="animate-fadeInUp delay-1">Book MD Consultation</h1>
                    <p className="animate-fadeInUp delay-2">Choose a physician and schedule your consultation</p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '900px', padding: '32px 24px 64px' }}>
                {/* Doctor Selection */}
                <h3 style={{ marginBottom: '16px' }}>Select Your Physician</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '16px',
                    marginBottom: '40px',
                }}>
                    {doctors.map(d => (
                        <div
                            key={d.id}
                            className="glass-card"
                            onClick={() => { setSelectedDoc(d.id); setSelectedDate(null); setSelectedTime(null); }}
                            style={{
                                padding: '24px',
                                cursor: 'pointer',
                                border: selectedDoc === d.id ? '2px solid var(--teal)' : '2px solid transparent',
                                background: selectedDoc === d.id ? 'rgba(166,139,91,0.08)' : undefined,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    background: 'rgba(166,139,91,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.4rem',
                                }}>
                                    {d.avatar}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem' }}>{d.name}</h4>
                                    <p style={{ color: 'var(--teal-light)', fontSize: '0.8rem' }}>{d.specialty}</p>
                                </div>
                            </div>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', lineHeight: '1.6' }}>{d.bio}</p>
                            {selectedDoc === d.id && (
                                <div style={{ marginTop: '12px' }}>
                                    <CheckCircle2 size={16} style={{ color: 'var(--teal-light)' }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Date Selection */}
                {doc && (
                    <>
                        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={20} style={{ color: 'var(--teal-light)' }} />
                            Select Date
                        </h3>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                            {doc.availableSlots.map(slot => {
                                const d = new Date(slot.date + 'T00:00:00');
                                const label = d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' });
                                return (
                                    <button
                                        key={slot.date}
                                        onClick={() => { setSelectedDate(slot.date); setSelectedTime(null); }}
                                        className={selectedDate === slot.date ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Time Selection */}
                {dateSlots && (
                    <>
                        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={20} style={{ color: 'var(--teal-light)' }} />
                            Select Time
                        </h3>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
                            {dateSlots.times.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTime(t)}
                                    className={selectedTime === t ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* Confirmation */}
                {selectedTime && doc && (
                    <div className="glass-card animate-fadeInUp" style={{
                        padding: '32px',
                        borderLeft: '4px solid var(--gold)',
                        marginBottom: '32px',
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>Booking Summary</h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <User size={18} style={{ color: 'var(--teal-light)' }} />
                                <div>
                                    <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Physician</span>
                                    <p style={{ fontWeight: 600 }}>{doc.name}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={18} style={{ color: 'var(--teal-light)' }} />
                                <div>
                                    <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Date</span>
                                    <p style={{ fontWeight: 600 }}>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Clock size={18} style={{ color: 'var(--teal-light)' }} />
                                <div>
                                    <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Time</span>
                                    <p style={{ fontWeight: 600 }}>{selectedTime}</p>
                                </div>
                            </div>
                            {state.aoNumber && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CheckCircle2 size={18} style={{ color: 'var(--gold)' }} />
                                    <div>
                                        <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Assessment Order</span>
                                        <p style={{ fontWeight: 600, color: 'var(--gold-light)' }}>{state.aoNumber}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {selectedTime && (
                    <div style={{ textAlign: 'center' }}>
                        <button className="btn btn-gold btn-lg" onClick={handleBook}>
                            Confirm Booking <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
