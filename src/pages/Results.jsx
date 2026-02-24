import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import peptides from '../data/peptides';
import { Copy, Stethoscope, AlertTriangle, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Results() {
    const navigate = useNavigate();
    const { state } = useAssessment();
    const [copied, setCopied] = useState(false);

    if (!state.aoNumber || !state.recommendations?.length) {
        return (
            <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="container" style={{ maxWidth: '500px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '16px' }}>No Results Yet</h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>Please complete the assessment first.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/terms')}>Start Assessment</button>
                </div>
            </div>
        );
    }

    const recommended = peptides.filter(p => state.recommendations.includes(p.id));

    const copyAO = () => {
        navigator.clipboard.writeText(state.aoNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="badge badge-gold animate-fadeInUp" style={{ marginBottom: '16px' }}>
                        <Sparkles size={12} style={{ marginRight: '4px' }} /> Step 3 of 5
                    </div>
                    <h1 className="animate-fadeInUp delay-1">Your Results</h1>
                    <p className="animate-fadeInUp delay-2">Based on your assessment, here are your recommended options</p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '900px', padding: '32px 24px 64px' }}>
                {/* AO number display */}
                <div className="glass-card animate-fadeInUp" style={{
                    padding: '24px 32px',
                    marginBottom: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    borderLeft: '4px solid var(--teal)',
                }}>
                    <div>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginBottom: '4px' }}>Your Assessment Order Number</p>
                        <h2 style={{ fontSize: '1.4rem', color: 'var(--teal-light)', letterSpacing: '1px' }}>{state.aoNumber}</h2>
                    </div>
                    <button className="btn btn-sm btn-outline" onClick={copyAO}>
                        {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy AO#</>}
                    </button>
                </div>

                {/* Credentials */}
                {state.credentials && (
                    <div className="glass-card animate-fadeInUp delay-1" style={{
                        padding: '20px 28px',
                        marginBottom: '32px',
                        background: 'rgba(192,122,74,0.06)',
                        borderLeft: '4px solid var(--gold)',
                    }}>
                        <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={16} style={{ color: 'var(--gold)' }} />
                            Save Your Login Credentials
                        </h4>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '12px' }}>
                            You'll need these to access the purchase portal after MD approval.
                        </p>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                            <div>
                                <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Email</span>
                                <p style={{ color: 'var(--white)', fontWeight: 600 }}>{state.credentials.email}</p>
                            </div>
                            <div>
                                <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Password</span>
                                <p style={{ color: 'var(--white)', fontWeight: 600, fontFamily: 'monospace' }}>{state.credentials.password}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="animate-fadeInUp delay-2" style={{
                    padding: '16px 20px',
                    background: 'rgba(122,155,191,0.08)',
                    border: '1px solid rgba(122,155,191,0.2)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '32px',
                    color: 'var(--info)',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                }}>
                    <AlertTriangle size={18} style={{ minWidth: 18, marginTop: 2 }} />
                    <span>
                        These are preliminary recommendations based on your health assessment. They are <strong>not approved</strong> until reviewed by a licensed physician during your consultation.
                    </span>
                </div>

                {/* Recommended peptides */}
                <h3 style={{ marginBottom: '20px' }}>Suggested for MD Evaluation</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '48px',
                }}>
                    {recommended.map((p, i) => (
                        <div key={p.id} className="glass-card animate-fadeInUp" style={{
                            padding: '28px',
                            animationDelay: `${0.2 + i * 0.1}s`,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <span style={{ fontSize: '2.2rem' }}>{p.image}</span>
                                <span className="badge badge-teal">{p.category}</span>
                            </div>
                            <h4 style={{ marginBottom: '8px' }}>{p.name}</h4>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>{p.description}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {p.benefits.map((b, j) => (
                                    <span key={j} style={{
                                        padding: '4px 10px',
                                        background: 'rgba(166,139,91,0.1)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.75rem',
                                        color: 'var(--teal-light)',
                                    }}>{b}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/book-md')}>
                        <Stethoscope size={20} /> Book Consultation with MD
                    </button>
                </div>
            </div>
        </div>
    );
}
