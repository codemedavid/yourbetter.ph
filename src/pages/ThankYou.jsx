import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { CheckCircle2, Copy, Check, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';

export default function ThankYou() {
    const navigate = useNavigate();
    const { state } = useAssessment();
    const [copied, setCopied] = useState(false);

    const copyAO = () => {
        navigator.clipboard.writeText(state.aoNumber || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
            <div className="container" style={{ maxWidth: '650px', textAlign: 'center', padding: '48px 24px' }}>
                <div className="animate-fadeInUp" style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'rgba(107,143,86,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                }}>
                    <CheckCircle2 size={40} style={{ color: 'var(--success)' }} />
                </div>

                <h1 className="animate-fadeInUp delay-1" style={{ marginBottom: '16px' }}>Booking Confirmed!</h1>
                <p className="animate-fadeInUp delay-2" style={{ color: 'var(--gray-400)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.7' }}>
                    Your consultation has been scheduled. A licensed physician will review your assessment and prepare for your appointment.
                </p>

                {/* Booking details */}
                {state.booking && (
                    <div className="glass-card animate-fadeInUp delay-2" style={{ padding: '24px', marginBottom: '24px', textAlign: 'left' }}>
                        <h4 style={{ marginBottom: '16px' }}>Booking Details</h4>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--gray-500)' }}>Physician</span>
                                <span style={{ fontWeight: 600 }}>{state.booking.doctorName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--gray-500)' }}>Date</span>
                                <span style={{ fontWeight: 600 }}>{state.booking.date}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--gray-500)' }}>Time</span>
                                <span style={{ fontWeight: 600 }}>{state.booking.time}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* AO# */}
                <div className="glass-card animate-fadeInUp delay-3" style={{
                    padding: '24px',
                    marginBottom: '32px',
                    borderLeft: '4px solid var(--gold)',
                    textAlign: 'left',
                }}>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginBottom: '8px' }}>Your Assessment Order Number</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <h3 style={{ color: 'var(--gold-light)', letterSpacing: '1px' }}>{state.aoNumber}</h3>
                        <button className="btn btn-sm btn-outline" onClick={copyAO}>
                            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                        </button>
                    </div>
                </div>

                {/* Next steps */}
                <div className="glass-card animate-fadeInUp delay-4" style={{
                    padding: '28px',
                    marginBottom: '32px',
                    textAlign: 'left',
                    background: 'rgba(166,139,91,0.06)',
                    borderLeft: '4px solid var(--teal)',
                }}>
                    <h4 style={{ marginBottom: '12px' }}>What's Next?</h4>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '16px' }}>
                        You're almost done. Your doctor will review your assessment.
                        If you've been approved, please message our admin to confirm and activate your purchase access.
                    </p>
                    <p style={{ color: 'var(--gray-300)', fontWeight: 600, fontSize: '0.9rem' }}>
                        Keep your Assessment Order Number: <span style={{ color: 'var(--gold-light)' }}>{state.aoNumber}</span>
                    </p>
                </div>

                {/* Contact admin */}
                <div className="animate-fadeInUp delay-5" style={{ marginBottom: '32px' }}>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '12px' }}>Contact Admin via:</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <a href="https://m.me/betteryou.ph" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                            <MessageCircle size={16} /> Messenger
                        </a>
                        <a href="https://wa.me/639271234567" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                            <Phone size={16} /> WhatsApp
                        </a>
                        <a href="viber://chat?number=639271234567" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                            <Phone size={16} /> Viber
                        </a>
                    </div>
                </div>

                <button className="btn btn-ghost" onClick={() => navigate('/')}>
                    Back to Home
                </button>
            </div>
        </div>
    );
}
