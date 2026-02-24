import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowRight, Shield, Stethoscope, ClipboardCheck, ShoppingBag,
    ChevronDown, ChevronUp, Sparkles, HeartPulse, Zap, CheckCircle2
} from 'lucide-react';
import faqs from '../data/faqs';

export default function Landing() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="page">
            {/* HERO */}
            <section style={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(166,139,91,0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(192,122,74,0.1) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />

                <div className="container">
                    <div style={{ maxWidth: '720px' }}>
                        <div className="badge badge-teal animate-fadeInUp" style={{ marginBottom: '24px' }}>
                            <Sparkles size={12} style={{ marginRight: '4px' }} /> MD-Led Peptide Therapy Program
                        </div>
                        <h1 className="animate-fadeInUp delay-1" style={{ marginBottom: '24px' }}>
                            Unlock Your Body's
                            <span style={{
                                background: 'var(--gradient-teal)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: 'block',
                            }}>
                                Full Potential
                            </span>
                        </h1>
                        <p className="animate-fadeInUp delay-2" style={{
                            fontSize: '1.2rem',
                            color: 'var(--gray-300)',
                            lineHeight: '1.8',
                            marginBottom: '40px',
                            maxWidth: '580px',
                        }}>
                            Doctor-supervised peptide protocols tailored to your unique health profile.
                            From assessment to delivery — science-backed, safe, and personalized.
                        </p>
                        <div className="animate-fadeInUp delay-3" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/terms')}>
                                Start Assessment <ArrowRight size={20} />
                            </button>
                            <a href="#how-it-works" className="btn btn-ghost btn-lg">Learn More</a>
                        </div>

                        <div className="animate-fadeInUp delay-4" style={{ display: 'flex', gap: '32px', marginTop: '48px', flexWrap: 'wrap' }}>
                            {[
                                { icon: <Shield size={18} />, text: 'Licensed MDs' },
                                { icon: <HeartPulse size={18} />, text: 'Pharma-Grade' },
                                { icon: <Zap size={18} />, text: 'Verified COA' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--teal-light)' }}>{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="section" style={{ background: 'var(--navy-light)' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="badge badge-gold" style={{ marginBottom: '16px' }}>Simple Process</div>
                        <h2>How It Works</h2>
                        <p>Three simple steps from assessment to your personalized peptide protocol</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '32px',
                    }}>
                        {[
                            {
                                icon: <ClipboardCheck size={32} />,
                                step: '01',
                                title: 'Complete Assessment',
                                desc: 'Answer our comprehensive health questionnaire. We analyze your medical history, lifestyle, and goals to identify the right peptides for you.',
                            },
                            {
                                icon: <Stethoscope size={32} />,
                                step: '02',
                                title: 'MD Consultation',
                                desc: 'A licensed physician reviews your assessment, confirms suitability, and approves your personalized peptide protocol.',
                            },
                            {
                                icon: <ShoppingBag size={32} />,
                                step: '03',
                                title: 'Purchase & Receive',
                                desc: 'Once approved, access your secure purchase portal. Order your physician-approved peptides and get them delivered to your door.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
                                <div style={{
                                    width: '68px',
                                    height: '68px',
                                    borderRadius: '50%',
                                    background: 'rgba(166,139,91,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    color: 'var(--teal-light)',
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', marginBottom: '8px' }}>
                                    STEP {item.step}
                                </div>
                                <h3 style={{ marginBottom: '12px' }}>{item.title}</h3>
                                <p style={{ color: 'var(--gray-400)', lineHeight: '1.7' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SAFETY */}
            <section id="safety" className="section">
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '48px',
                        alignItems: 'center',
                    }}>
                        <div>
                            <div className="badge badge-teal" style={{ marginBottom: '16px' }}>Your Safety First</div>
                            <h2 style={{ marginBottom: '24px' }}>MD-Led. Science-Backed.</h2>
                            <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '32px' }}>
                                Every step of your peptide journey is supervised by licensed physicians in the Philippines.
                                We use only pharmaceutical-grade peptides with verified Certificates of Analysis.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    'Licensed physicians review every assessment',
                                    'Pharmaceutical-grade peptides only',
                                    'Third-party lab-verified COA for every batch',
                                    'Personalized dosing and protocol guidance',
                                    'Ongoing medical support throughout your program',
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <CheckCircle2 size={20} style={{ color: 'var(--success)', minWidth: '20px' }} />
                                        <span style={{ color: 'var(--gray-300)' }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card" style={{
                            padding: '48px 32px',
                            textAlign: 'center',
                            background: 'var(--gradient-card)',
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔬</div>
                            <h3 style={{ marginBottom: '12px' }}>Science-Driven Approach</h3>
                            <p style={{ color: 'var(--gray-400)', lineHeight: '1.7', marginBottom: '24px' }}>
                                Our assessment algorithm matches your health profile with evidence-based peptide protocols.
                                No guesswork — just data-driven recommendations reviewed by real doctors.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                                {[
                                    { value: '500+', label: 'Assessments' },
                                    { value: '3', label: 'Licensed MDs' },
                                    { value: '98%', label: 'Approval Rate' },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--teal-light)', fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQS */}
            <section id="faqs" className="section" style={{ background: 'var(--navy-light)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="section-header">
                        <div className="badge badge-gold" style={{ marginBottom: '16px' }}>Got Questions?</div>
                        <h2>Frequently Asked Questions</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="glass-card"
                                style={{
                                    padding: '0',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                }}
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <div style={{
                                    padding: '20px 24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '16px',
                                }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{faq.question}</h4>
                                    {openFaq === i ? <ChevronUp size={20} style={{ color: 'var(--teal-light)', minWidth: 20 }} /> : <ChevronDown size={20} style={{ color: 'var(--gray-500)', minWidth: 20 }} />}
                                </div>
                                {openFaq === i && (
                                    <div style={{
                                        padding: '0 24px 20px',
                                        color: 'var(--gray-400)',
                                        lineHeight: '1.7',
                                        animation: 'fadeIn 0.2s ease-out',
                                    }}>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="section" style={{ textAlign: 'center' }}>
                <div className="container">
                    <div className="badge badge-teal" style={{ marginBottom: '16px' }}>Ready to Start?</div>
                    <h2 style={{ marginBottom: '16px' }}>Begin Your Journey Today</h2>
                    <p style={{ color: 'var(--gray-400)', maxWidth: '500px', margin: '0 auto 32px', lineHeight: '1.7' }}>
                        Take the first step towards optimized health and performance.
                        Our assessment takes just a few minutes.
                    </p>
                    <button className="btn btn-gold btn-lg" onClick={() => navigate('/terms')}>
                        Start Free Assessment <ArrowRight size={20} />
                    </button>
                </div>
            </section>
        </div>
    );
}
