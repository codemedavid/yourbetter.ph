import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import StepIndicator from '../components/StepIndicator';
import peptides from '../data/peptides';
import { ArrowRight, ArrowLeft, ClipboardCheck } from 'lucide-react';

const STEPS = ['Personal Info', 'Medical History', 'Lifestyle', 'Goals'];

function recommendPeptides(answers) {
    const recs = [];
    if (answers.goals?.includes('recovery') || answers.goals?.includes('healing')) {
        recs.push('bpc-157', 'tb-500');
    }
    if (answers.goals?.includes('antiaging') || answers.goals?.includes('muscle')) {
        recs.push('cjc-1295');
    }
    if (answers.goals?.includes('weight')) {
        recs.push('semaglutide');
    }
    if (answers.goals?.includes('wellness') || answers.goals?.includes('libido')) {
        recs.push('pt-141');
    }
    if (answers.goals?.includes('energy') || answers.goals?.includes('longevity')) {
        recs.push('nad-plus');
    }
    if (recs.length === 0) recs.push('bpc-157', 'cjc-1295');
    return [...new Set(recs)];
}

export default function Assessment() {
    const navigate = useNavigate();
    const { state, dispatch } = useAssessment();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '', age: '', sex: '',
        conditions: '', medications: '', allergies: '', surgeries: '',
        exercise: '', sleep: '', diet: '', stress: '', smoking: '', alcohol: '',
        goals: [],
    });
    const [errors, setErrors] = useState({});

    if (!state.consent) {
        return (
            <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '80vh' }}>
                <div className="container" style={{ maxWidth: '500px' }}>
                    <h2 style={{ marginBottom: '16px' }}>Terms Required</h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>Please accept the terms and conditions before taking the assessment.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/terms')}>Go to Terms</button>
                </div>
            </div>
        );
    }

    const up = (field, value) => setForm(p => ({ ...p, [field]: value }));

    const validateStep = () => {
        const e = {};
        if (step === 0) {
            if (!form.firstName.trim()) e.firstName = 'Required';
            if (!form.lastName.trim()) e.lastName = 'Required';
            if (!form.email.trim()) e.email = 'Required';
            if (!form.age) e.age = 'Required';
            if (!form.sex) e.sex = 'Required';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => { if (validateStep()) setStep(s => s + 1); };
    const prev = () => setStep(s => s - 1);

    const handleSubmit = () => {
        const recs = recommendPeptides(form);
        const pw = Math.random().toString(36).slice(2, 10);
        dispatch({
            type: 'SUBMIT_ASSESSMENT',
            payload: {
                answers: form,
                recommendations: recs,
                credentials: { email: form.email, password: pw },
            },
        });
        navigate('/results');
    };

    const toggleGoal = (g) => {
        setForm(p => ({
            ...p,
            goals: p.goals.includes(g) ? p.goals.filter(x => x !== g) : [...p.goals, g],
        }));
    };

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="badge badge-teal animate-fadeInUp" style={{ marginBottom: '16px' }}>
                        <ClipboardCheck size={12} style={{ marginRight: '4px' }} /> Step 2 of 5
                    </div>
                    <h1 className="animate-fadeInUp delay-1">Health Assessment</h1>
                    <p className="animate-fadeInUp delay-2">AO# {state.aoNumber}</p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '700px', padding: '32px 24px 64px' }}>
                <StepIndicator steps={STEPS} currentStep={step} />

                <div className="glass-card" style={{ padding: '32px' }}>
                    {/* Step 0: Personal */}
                    {step === 0 && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '24px' }}>Personal Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">First Name *</label>
                                    <input className="form-input" value={form.firstName} onChange={e => up('firstName', e.target.value)} placeholder="Juan" />
                                    {errors.firstName && <p className="form-error">{errors.firstName}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name *</label>
                                    <input className="form-input" value={form.lastName} onChange={e => up('lastName', e.target.value)} placeholder="Dela Cruz" />
                                    {errors.lastName && <p className="form-error">{errors.lastName}</p>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address *</label>
                                <input className="form-input" type="email" value={form.email} onChange={e => up('email', e.target.value)} placeholder="juan@email.com" />
                                {errors.email && <p className="form-error">{errors.email}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input className="form-input" value={form.phone} onChange={e => up('phone', e.target.value)} placeholder="0917 XXX XXXX" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Age *</label>
                                    <input className="form-input" type="number" value={form.age} onChange={e => up('age', e.target.value)} placeholder="30" />
                                    {errors.age && <p className="form-error">{errors.age}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Biological Sex *</label>
                                    <select className="form-select" value={form.sex} onChange={e => up('sex', e.target.value)}>
                                        <option value="">Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.sex && <p className="form-error">{errors.sex}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Medical */}
                    {step === 1 && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '24px' }}>Medical History</h3>
                            <div className="form-group">
                                <label className="form-label">Existing Medical Conditions</label>
                                <textarea className="form-textarea" value={form.conditions} onChange={e => up('conditions', e.target.value)} placeholder="e.g., Diabetes, Hypertension, None..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Current Medications</label>
                                <textarea className="form-textarea" value={form.medications} onChange={e => up('medications', e.target.value)} placeholder="List any medications you are currently taking..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Known Allergies</label>
                                <input className="form-input" value={form.allergies} onChange={e => up('allergies', e.target.value)} placeholder="e.g., Penicillin, None..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Past Surgeries</label>
                                <input className="form-input" value={form.surgeries} onChange={e => up('surgeries', e.target.value)} placeholder="e.g., Appendectomy 2020, None..." />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Lifestyle */}
                    {step === 2 && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '24px' }}>Lifestyle</h3>
                            <div className="form-group">
                                <label className="form-label">Exercise Frequency</label>
                                <select className="form-select" value={form.exercise} onChange={e => up('exercise', e.target.value)}>
                                    <option value="">Select...</option>
                                    <option value="none">No regular exercise</option>
                                    <option value="light">1–2x per week</option>
                                    <option value="moderate">3–4x per week</option>
                                    <option value="active">5+ times per week</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Average Sleep (hours / night)</label>
                                <select className="form-select" value={form.sleep} onChange={e => up('sleep', e.target.value)}>
                                    <option value="">Select...</option>
                                    <option value="less5">Less than 5 hours</option>
                                    <option value="5to6">5–6 hours</option>
                                    <option value="7to8">7–8 hours</option>
                                    <option value="more8">More than 8 hours</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Diet Type</label>
                                <select className="form-select" value={form.diet} onChange={e => up('diet', e.target.value)}>
                                    <option value="">Select...</option>
                                    <option value="standard">Standard / Mixed</option>
                                    <option value="keto">Keto / Low-Carb</option>
                                    <option value="vegan">Vegan / Plant-Based</option>
                                    <option value="paleo">Paleo</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Stress Level</label>
                                    <select className="form-select" value={form.stress} onChange={e => up('stress', e.target.value)}>
                                        <option value="">Select...</option>
                                        <option value="low">Low</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Smoking</label>
                                    <select className="form-select" value={form.smoking} onChange={e => up('smoking', e.target.value)}>
                                        <option value="">Select...</option>
                                        <option value="no">Non-smoker</option>
                                        <option value="former">Former smoker</option>
                                        <option value="yes">Current smoker</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Goals */}
                    {step === 3 && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '8px' }}>Your Goals</h3>
                            <p style={{ color: 'var(--gray-400)', marginBottom: '24px', fontSize: '0.9rem' }}>Select all that apply to help us recommend the right peptides:</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                {[
                                    { id: 'recovery', label: '🩹 Recovery & Healing', desc: 'Tissue repair, joint health' },
                                    { id: 'healing', label: '💊 Gut Health', desc: 'Gut lining, digestion' },
                                    { id: 'antiaging', label: '🧬 Anti-Aging', desc: 'Skin, hair, vitality' },
                                    { id: 'muscle', label: '💪 Lean Muscle', desc: 'Body composition' },
                                    { id: 'weight', label: '⚖️ Weight Management', desc: 'Appetite, metabolism' },
                                    { id: 'energy', label: '⚡ Energy & Focus', desc: 'Mental clarity, stamina' },
                                    { id: 'wellness', label: '❤️ Sexual Wellness', desc: 'Libido, intimacy' },
                                    { id: 'longevity', label: '🔬 Longevity', desc: 'Cellular health, DNA repair' },
                                ].map(g => (
                                    <div
                                        key={g.id}
                                        onClick={() => toggleGoal(g.id)}
                                        style={{
                                            padding: '16px',
                                            borderRadius: 'var(--radius-md)',
                                            border: form.goals.includes(g.id) ? '2px solid var(--teal)' : '2px solid rgba(255,255,255,0.08)',
                                            background: form.goals.includes(g.id) ? 'rgba(166,139,91,0.1)' : 'rgba(255,255,255,0.03)',
                                            cursor: 'pointer',
                                            transition: 'all var(--transition-fast)',
                                        }}
                                    >
                                        <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{g.label}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{g.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', gap: '16px' }}>
                        {step > 0 ? (
                            <button className="btn btn-ghost" onClick={prev}>
                                <ArrowLeft size={18} /> Back
                            </button>
                        ) : <div />}
                        {step < STEPS.length - 1 ? (
                            <button className="btn btn-primary" onClick={next}>
                                Next <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button className="btn btn-gold" onClick={handleSubmit}>
                                Submit Assessment <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
