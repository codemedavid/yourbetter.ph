import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { ShieldCheck, ArrowRight, FileText } from 'lucide-react';

export default function Terms() {
    const navigate = useNavigate();
    const { dispatch } = useAssessment();
    const [checks, setChecks] = useState({ age: false, medical: false, privacy: false });

    const allChecked = checks.age && checks.medical && checks.privacy;

    const handleAgree = () => {
        dispatch({ type: 'ACCEPT_TERMS' });
        navigate('/assessment');
    };

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="badge badge-teal animate-fadeInUp" style={{ marginBottom: '16px' }}>
                        <FileText size={12} style={{ marginRight: '4px' }} /> Step 1 of 5
                    </div>
                    <h1 className="animate-fadeInUp delay-1">Terms & Conditions</h1>
                    <p className="animate-fadeInUp delay-2">Please review and accept our terms before proceeding with your assessment</p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '800px', padding: '48px 24px' }}>
                {/* Terms Content */}
                <div className="glass-card animate-fadeInUp delay-2" style={{
                    padding: '32px',
                    marginBottom: '32px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                }}>
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={20} style={{ color: 'var(--teal-light)' }} />
                        Program Terms & Medical Waiver
                    </h3>

                    <div style={{ color: 'var(--gray-400)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                        <p style={{ marginBottom: '16px' }}>
                            <strong style={{ color: 'var(--white)' }}>1. Program Overview</strong><br />
                            YourBetter.PH is a medically supervised peptide therapy program. All recommendations are generated based
                            on your health assessment and must be reviewed and approved by a licensed physician before any purchase can be made.
                        </p>
                        <p style={{ marginBottom: '16px' }}>
                            <strong style={{ color: 'var(--white)' }}>2. Medical Disclaimer</strong><br />
                            The information provided through this platform does not constitute medical advice. The assessment results
                            are preliminary recommendations that require physician evaluation. Peptide therapy may not be suitable for everyone.
                        </p>
                        <p style={{ marginBottom: '16px' }}>
                            <strong style={{ color: 'var(--white)' }}>3. Assessment & Consultation</strong><br />
                            By proceeding, you agree to provide accurate and complete health information. Deliberately providing false
                            or misleading information may result in inappropriate recommendations and program termination.
                        </p>
                        <p style={{ marginBottom: '16px' }}>
                            <strong style={{ color: 'var(--white)' }}>4. Physician Review</strong><br />
                            All peptide recommendations must be evaluated by a licensed physician. The physician has full authority to
                            approve, modify, or decline any recommendation based on their clinical judgment.
                        </p>
                        <p style={{ marginBottom: '16px' }}>
                            <strong style={{ color: 'var(--white)' }}>5. Data Privacy</strong><br />
                            Your personal and medical information is collected solely for the purpose of this program. We employ
                            industry-standard security measures and will not share your data with unauthorized third parties.
                        </p>
                        <p>
                            <strong style={{ color: 'var(--white)' }}>6. Acknowledgment</strong><br />
                            By checking the boxes below and proceeding, you acknowledge that you have read, understood, and agree to
                            these terms and conditions.
                        </p>
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="glass-card animate-fadeInUp delay-3" style={{ padding: '32px', marginBottom: '32px' }}>
                    <h4 style={{ marginBottom: '20px' }}>Please confirm the following:</h4>

                    <label className="form-checkbox" style={{ marginBottom: '12px' }}>
                        <input
                            type="checkbox"
                            checked={checks.age}
                            onChange={(e) => setChecks({ ...checks, age: e.target.checked })}
                        />
                        <div>
                            <strong style={{ color: 'var(--white)' }}>Age Confirmation</strong>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginTop: '4px' }}>
                                I confirm that I am at least 18 years of age and legally capable of entering into this agreement.
                            </p>
                        </div>
                    </label>

                    <label className="form-checkbox" style={{ marginBottom: '12px' }}>
                        <input
                            type="checkbox"
                            checked={checks.medical}
                            onChange={(e) => setChecks({ ...checks, medical: e.target.checked })}
                        />
                        <div>
                            <strong style={{ color: 'var(--white)' }}>Medical Waiver</strong>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginTop: '4px' }}>
                                I understand that peptide recommendations require physician approval and that I will provide truthful medical information.
                            </p>
                        </div>
                    </label>

                    <label className="form-checkbox">
                        <input
                            type="checkbox"
                            checked={checks.privacy}
                            onChange={(e) => setChecks({ ...checks, privacy: e.target.checked })}
                        />
                        <div>
                            <strong style={{ color: 'var(--white)' }}>Data Privacy Consent</strong>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginTop: '4px' }}>
                                I consent to the collection and processing of my personal and medical data for the sole purpose of this program.
                            </p>
                        </div>
                    </label>
                </div>

                {/* CTA */}
                <div className="animate-fadeInUp delay-4" style={{ textAlign: 'center' }}>
                    <button
                        className="btn btn-primary btn-lg"
                        disabled={!allChecked}
                        onClick={handleAgree}
                    >
                        I Agree & Continue <ArrowRight size={20} />
                    </button>
                    {!allChecked && (
                        <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '12px' }}>
                            Please check all boxes to continue
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
