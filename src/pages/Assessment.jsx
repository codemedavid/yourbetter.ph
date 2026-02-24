import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import StepIndicator from '../components/StepIndicator';
import peptides from '../data/peptides';
import { ArrowRight, ArrowLeft, ClipboardCheck } from 'lucide-react';

const STEPS = ['Patient Info', 'Medical History', 'Medications', 'Women\'s Health', 'Lifestyle', 'Weight History', 'Lab Results', 'Goals'];

/* ―――― Yes / No toggle component ―――― */
function YesNo({ label, value, onChange }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(250,246,241,0.06)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--gray-300)', flex: 1, paddingRight: '12px' }}>{label}</span>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {['Yes', 'No'].map(opt => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(opt.toLowerCase())}
                        style={{
                            padding: '6px 18px',
                            borderRadius: 'var(--radius-full)',
                            border: value === opt.toLowerCase() ? '2px solid var(--teal)' : '2px solid rgba(250,246,241,0.12)',
                            background: value === opt.toLowerCase() ? 'rgba(166,139,91,0.15)' : 'transparent',
                            color: value === opt.toLowerCase() ? 'var(--teal-light)' : 'var(--gray-500)',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ―――― Section sub-header ―――― */
function SubSection({ title }) {
    return (
        <h4 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '0.95rem', color: 'var(--gold-light)', borderBottom: '1px solid rgba(250,246,241,0.08)', paddingBottom: '6px' }}>
            {title}
        </h4>
    );
}

/* ―――― Peptide recommendation logic ―――― */
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
        /* I. Patient Information */
        fullName: '', age: '', sex: '', height: '', currentWeight: '', goalWeight: '',
        occupation: '', phone: '', email: '',

        /* II. Medical History — Metabolic & Endocrine */
        diabetes: '', prediabetes: '', insulinResistance: '', pcos: '',
        thyroidDisorder: '', thyroidCancerHistory: '', familyMTC: '', familyMEN2: '',
        /* GI */
        pancreatitis: '', gallstones: '', gerd: '', severeConstipation: '',
        ibs: '', bariatricSurgery: '',
        /* Cardiovascular */
        hypertension: '', heartDisease: '', stroke: '', anticoagulants: '',
        /* Renal & Hepatic */
        kidneyDisease: '', elevatedCreatinine: '', liverDisease: '', fattyLiver: '',

        /* III. Current Medications */
        takingInsulin: '', sulfonylureas: '', metformin: '', steroids: '',
        oralContraceptives: '', antidepressants: '', otherWeightLossMeds: '',
        peptidesInjectables: '', herbalSupplements: '',
        medicationsList: '',

        /* IV. Women's Health */
        pregnant: '', planningConceive: '', breastfeeding: '',
        lastMenstrualPeriod: '', irregularCycles: '',

        /* V. Lifestyle — Nutrition */
        mealsPerDay: '', highFatFoods: '', sugaryDrinksAlcohol: '',
        bingeEating: '', emotionalEating: '',
        /* Physical Activity */
        exerciseRegularly: '', exerciseType: '',
        /* Sleep & Stress */
        sleepHours: '', highStress: '', anxietyDepression: '',

        /* VI. Weight Loss History */
        previousAttempts: '', previousMeds: '', highestWeight: '', lowestWeight: '', barriers: '',

        /* VII. Baseline Labs */
        labFBS: '', labHbA1c: '', labLipid: '', labAST_ALT: '',
        labCreatinine: '', labTSH: '', labAmylaseLipase: '',

        /* VIII. Goals */
        goals: [],
    });
    const [errors, setErrors] = useState({});

    /* Auto-calc BMI */
    const bmi = useMemo(() => {
        const h = parseFloat(form.height);
        const w = parseFloat(form.currentWeight);
        if (h > 0 && w > 0) {
            const m = h / 100;
            return (w / (m * m)).toFixed(1);
        }
        return '';
    }, [form.height, form.currentWeight]);

    /* Build visible steps (skip Women's Health if not female) */
    const visibleSteps = useMemo(() => {
        if (form.sex === 'female') return STEPS;
        return STEPS.filter(s => s !== "Women's Health");
    }, [form.sex]);

    /* Map visible step index to actual step key */
    const stepKey = visibleSteps[step];

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
        if (stepKey === 'Patient Info') {
            if (!form.fullName.trim()) e.fullName = 'Required';
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
                answers: { ...form, bmi },
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

            <div className="container" style={{ maxWidth: '750px', padding: '32px 24px 64px' }}>
                <StepIndicator steps={visibleSteps} currentStep={step} />

                <div className="glass-card" style={{ padding: '32px' }}>

                    {/* ══════════ STEP: Patient Information ══════════ */}
                    {stepKey === 'Patient Info' && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '24px' }}>I. Patient Information</h3>
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input className="form-input" value={form.fullName} onChange={e => up('fullName', e.target.value)} placeholder="Juan Dela Cruz" />
                                {errors.fullName && <p className="form-error">{errors.fullName}</p>}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Age *</label>
                                    <input className="form-input" type="number" value={form.age} onChange={e => up('age', e.target.value)} placeholder="30" />
                                    {errors.age && <p className="form-error">{errors.age}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Sex *</label>
                                    <select className="form-select" value={form.sex} onChange={e => up('sex', e.target.value)}>
                                        <option value="">Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.sex && <p className="form-error">{errors.sex}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Occupation</label>
                                    <input className="form-input" value={form.occupation} onChange={e => up('occupation', e.target.value)} placeholder="e.g., Engineer" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Height (cm)</label>
                                    <input className="form-input" type="number" value={form.height} onChange={e => up('height', e.target.value)} placeholder="170" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Current Weight (kg)</label>
                                    <input className="form-input" type="number" value={form.currentWeight} onChange={e => up('currentWeight', e.target.value)} placeholder="75" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Goal Weight (kg)</label>
                                    <input className="form-input" type="number" value={form.goalWeight} onChange={e => up('goalWeight', e.target.value)} placeholder="65" />
                                </div>
                            </div>
                            {bmi && (
                                <div style={{
                                    padding: '12px 16px', marginBottom: '16px',
                                    background: 'rgba(166,139,91,0.1)', borderRadius: 'var(--radius-md)',
                                    border: '1px solid rgba(166,139,91,0.2)',
                                }}>
                                    <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>Calculated BMI: </span>
                                    <span style={{ color: 'var(--teal-light)', fontWeight: 700, fontSize: '1.1rem' }}>{bmi}</span>
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Contact Number</label>
                                    <input className="form-input" value={form.phone} onChange={e => up('phone', e.target.value)} placeholder="0917 XXX XXXX" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address *</label>
                                    <input className="form-input" type="email" value={form.email} onChange={e => up('email', e.target.value)} placeholder="juan@email.com" />
                                    {errors.email && <p className="form-error">{errors.email}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════ STEP: Medical History ══════════ */}
                    {stepKey === 'Medical History' && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '8px' }}>II. Medical History</h3>
                            <p style={{ color: 'var(--gray-500)', marginBottom: '16px', fontSize: '0.85rem' }}>Please answer Yes or No to each question.</p>

                            <SubSection title="A. Metabolic and Endocrine" />
                            <YesNo label="Do you have Type 2 Diabetes?" value={form.diabetes} onChange={v => up('diabetes', v)} />
                            <YesNo label="Prediabetes?" value={form.prediabetes} onChange={v => up('prediabetes', v)} />
                            <YesNo label="Insulin resistance?" value={form.insulinResistance} onChange={v => up('insulinResistance', v)} />
                            <YesNo label="PCOS?" value={form.pcos} onChange={v => up('pcos', v)} />
                            <YesNo label="Thyroid disorder (hypothyroidism, hyperthyroidism, nodules)?" value={form.thyroidDisorder} onChange={v => up('thyroidDisorder', v)} />
                            <YesNo label="Personal history of thyroid cancer?" value={form.thyroidCancerHistory} onChange={v => up('thyroidCancerHistory', v)} />
                            <YesNo label="Family history of Medullary Thyroid Carcinoma (MTC)?" value={form.familyMTC} onChange={v => up('familyMTC', v)} />
                            <YesNo label="Family history of Multiple Endocrine Neoplasia Type 2 (MEN2)?" value={form.familyMEN2} onChange={v => up('familyMEN2', v)} />

                            <SubSection title="B. Gastrointestinal" />
                            <YesNo label="History of pancreatitis?" value={form.pancreatitis} onChange={v => up('pancreatitis', v)} />
                            <YesNo label="Gallstones or gallbladder disease?" value={form.gallstones} onChange={v => up('gallstones', v)} />
                            <YesNo label="Chronic acid reflux or GERD?" value={form.gerd} onChange={v => up('gerd', v)} />
                            <YesNo label="Severe constipation?" value={form.severeConstipation} onChange={v => up('severeConstipation', v)} />
                            <YesNo label="Irritable bowel syndrome?" value={form.ibs} onChange={v => up('ibs', v)} />
                            <YesNo label="History of gastric or bariatric surgery?" value={form.bariatricSurgery} onChange={v => up('bariatricSurgery', v)} />

                            <SubSection title="C. Cardiovascular" />
                            <YesNo label="Hypertension?" value={form.hypertension} onChange={v => up('hypertension', v)} />
                            <YesNo label="Heart disease?" value={form.heartDisease} onChange={v => up('heartDisease', v)} />
                            <YesNo label="History of stroke?" value={form.stroke} onChange={v => up('stroke', v)} />
                            <YesNo label="On anticoagulants or blood thinners?" value={form.anticoagulants} onChange={v => up('anticoagulants', v)} />

                            <SubSection title="D. Renal and Hepatic" />
                            <YesNo label="Kidney disease?" value={form.kidneyDisease} onChange={v => up('kidneyDisease', v)} />
                            <YesNo label="Elevated creatinine?" value={form.elevatedCreatinine} onChange={v => up('elevatedCreatinine', v)} />
                            <YesNo label="Liver disease?" value={form.liverDisease} onChange={v => up('liverDisease', v)} />
                            <YesNo label="Fatty liver?" value={form.fattyLiver} onChange={v => up('fattyLiver', v)} />
                        </div>
                    )}

                    {/* ══════════ STEP: Current Medications ══════════ */}
                    {stepKey === 'Medications' && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '8px' }}>III. Current Medications</h3>
                            <p style={{ color: 'var(--gray-500)', marginBottom: '16px', fontSize: '0.85rem' }}>Are you currently taking any of the following?</p>

                            <YesNo label="Insulin?" value={form.takingInsulin} onChange={v => up('takingInsulin', v)} />
                            <YesNo label="Sulfonylureas?" value={form.sulfonylureas} onChange={v => up('sulfonylureas', v)} />
                            <YesNo label="Metformin?" value={form.metformin} onChange={v => up('metformin', v)} />
                            <YesNo label="Steroids?" value={form.steroids} onChange={v => up('steroids', v)} />
                            <YesNo label="Oral contraceptives?" value={form.oralContraceptives} onChange={v => up('oralContraceptives', v)} />
                            <YesNo label="Antidepressants or anti-anxiety medications?" value={form.antidepressants} onChange={v => up('antidepressants', v)} />
                            <YesNo label="Other weight loss medications?" value={form.otherWeightLossMeds} onChange={v => up('otherWeightLossMeds', v)} />
                            <YesNo label="Peptides or injectable therapies?" value={form.peptidesInjectables} onChange={v => up('peptidesInjectables', v)} />
                            <YesNo label="Herbal supplements or vitamins?" value={form.herbalSupplements} onChange={v => up('herbalSupplements', v)} />

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">List all medications and supplements with dosage and frequency:</label>
                                <textarea className="form-textarea" value={form.medicationsList} onChange={e => up('medicationsList', e.target.value)} placeholder="e.g., Metformin 500mg twice daily, Vitamin D 1000IU daily..." style={{ minHeight: '100px' }} />
                            </div>
                        </div>
                    )}

                    {/* ══════════ STEP: Women's Health (Female only) ══════════ */}
                    {stepKey === "Women's Health" && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '8px' }}>IV. Women's Health</h3>
                            <p style={{ color: 'var(--gray-500)', marginBottom: '16px', fontSize: '0.85rem' }}>This section applies to female patients.</p>

                            <YesNo label="Are you pregnant?" value={form.pregnant} onChange={v => up('pregnant', v)} />
                            <YesNo label="Planning to conceive within the next 3 months?" value={form.planningConceive} onChange={v => up('planningConceive', v)} />
                            <YesNo label="Breastfeeding?" value={form.breastfeeding} onChange={v => up('breastfeeding', v)} />
                            <YesNo label="History of irregular cycles?" value={form.irregularCycles} onChange={v => up('irregularCycles', v)} />

                            <div className="form-group" style={{ marginTop: '16px' }}>
                                <label className="form-label">Date of last menstrual period</label>
                                <input className="form-input" type="date" value={form.lastMenstrualPeriod} onChange={e => up('lastMenstrualPeriod', e.target.value)} />
                            </div>
                        </div>
                    )}

                    {/* ══════════ STEP: Lifestyle ══════════ */}
                    {stepKey === 'Lifestyle' && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '8px' }}>V. Lifestyle Assessment</h3>

                            <SubSection title="A. Nutrition" />
                            <div className="form-group">
                                <label className="form-label">How many meals per day do you eat?</label>
                                <select className="form-select" value={form.mealsPerDay} onChange={e => up('mealsPerDay', e.target.value)}>
                                    <option value="">Select...</option>
                                    <option value="1">1 meal</option>
                                    <option value="2">2 meals</option>
                                    <option value="3">3 meals</option>
                                    <option value="4">4 meals</option>
                                    <option value="5+">5 or more meals</option>
                                </select>
                            </div>
                            <YesNo label="Do you frequently consume high-fat or fried foods?" value={form.highFatFoods} onChange={v => up('highFatFoods', v)} />
                            <YesNo label="Do you consume sugary drinks or alcohol regularly?" value={form.sugaryDrinksAlcohol} onChange={v => up('sugaryDrinksAlcohol', v)} />
                            <YesNo label="History of binge eating?" value={form.bingeEating} onChange={v => up('bingeEating', v)} />
                            <YesNo label="Emotional eating triggers?" value={form.emotionalEating} onChange={v => up('emotionalEating', v)} />

                            <SubSection title="B. Physical Activity" />
                            <YesNo label="Do you exercise regularly?" value={form.exerciseRegularly} onChange={v => up('exerciseRegularly', v)} />
                            {form.exerciseRegularly === 'yes' && (
                                <div className="form-group" style={{ marginTop: '8px' }}>
                                    <label className="form-label">Type of exercise and frequency:</label>
                                    <input className="form-input" value={form.exerciseType} onChange={e => up('exerciseType', e.target.value)} placeholder="e.g., Running 3x/week, Gym 4x/week" />
                                </div>
                            )}

                            <SubSection title="C. Sleep and Stress" />
                            <div className="form-group">
                                <label className="form-label">Average hours of sleep per night:</label>
                                <select className="form-select" value={form.sleepHours} onChange={e => up('sleepHours', e.target.value)}>
                                    <option value="">Select...</option>
                                    <option value="less5">Less than 5 hours</option>
                                    <option value="5to6">5–6 hours</option>
                                    <option value="7to8">7–8 hours</option>
                                    <option value="more8">More than 8 hours</option>
                                </select>
                            </div>
                            <YesNo label="High stress levels?" value={form.highStress} onChange={v => up('highStress', v)} />
                            <YesNo label="History of anxiety or depression?" value={form.anxietyDepression} onChange={v => up('anxietyDepression', v)} />
                        </div>
                    )}

                    {/* ══════════ STEP: Weight Loss History ══════════ */}
                    {stepKey === 'Weight History' && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '24px' }}>VI. Weight Loss History</h3>
                            <div className="form-group">
                                <label className="form-label">Previous weight loss attempts:</label>
                                <textarea className="form-textarea" value={form.previousAttempts} onChange={e => up('previousAttempts', e.target.value)} placeholder="Describe any diets, programs, or methods tried..." style={{ minHeight: '80px' }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Medications previously used for weight loss:</label>
                                <input className="form-input" value={form.previousMeds} onChange={e => up('previousMeds', e.target.value)} placeholder="e.g., Orlistat, Phentermine, None..." />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Highest weight recorded (kg):</label>
                                    <input className="form-input" type="number" value={form.highestWeight} onChange={e => up('highestWeight', e.target.value)} placeholder="90" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Lowest adult weight (kg):</label>
                                    <input className="form-input" type="number" value={form.lowestWeight} onChange={e => up('lowestWeight', e.target.value)} placeholder="55" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Barriers to weight loss:</label>
                                <textarea className="form-textarea" value={form.barriers} onChange={e => up('barriers', e.target.value)} placeholder="e.g., Time constraints, motivation, emotional eating..." style={{ minHeight: '80px' }} />
                            </div>
                        </div>
                    )}

                    {/* ══════════ STEP: Baseline Lab Results ══════════ */}
                    {stepKey === 'Lab Results' && (
                        <div className="animate-fadeIn">
                            <h3 style={{ marginBottom: '8px' }}>VII. Baseline Laboratory Results</h3>
                            <p style={{ color: 'var(--gray-500)', marginBottom: '20px', fontSize: '0.85rem' }}>If available, enter your most recent lab results. Leave blank if not available.</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Fasting Blood Sugar (mg/dL)</label>
                                    <input className="form-input" type="number" value={form.labFBS} onChange={e => up('labFBS', e.target.value)} placeholder="e.g., 95" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">HbA1c (%)</label>
                                    <input className="form-input" type="number" step="0.1" value={form.labHbA1c} onChange={e => up('labHbA1c', e.target.value)} placeholder="e.g., 5.6" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Lipid Profile</label>
                                    <input className="form-input" value={form.labLipid} onChange={e => up('labLipid', e.target.value)} placeholder="e.g., TC 200, LDL 120, HDL 50" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Liver Function (AST / ALT)</label>
                                    <input className="form-input" value={form.labAST_ALT} onChange={e => up('labAST_ALT', e.target.value)} placeholder="e.g., AST 25 / ALT 30" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Creatinine (mg/dL)</label>
                                    <input className="form-input" type="number" step="0.1" value={form.labCreatinine} onChange={e => up('labCreatinine', e.target.value)} placeholder="e.g., 0.9" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">TSH (mIU/L)</label>
                                    <input className="form-input" type="number" step="0.01" value={form.labTSH} onChange={e => up('labTSH', e.target.value)} placeholder="e.g., 2.5" />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Amylase / Lipase (if clinically indicated)</label>
                                    <input className="form-input" value={form.labAmylaseLipase} onChange={e => up('labAmylaseLipase', e.target.value)} placeholder="e.g., Amylase 80 / Lipase 40" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════ STEP: Goals ══════════ */}
                    {stepKey === 'Goals' && (
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
                        {step < visibleSteps.length - 1 ? (
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
