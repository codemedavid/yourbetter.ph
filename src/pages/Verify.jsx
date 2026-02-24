import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../context/AssessmentContext';
import { Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Verify() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [aoNum, setAoNum] = useState('');
    const [error, setError] = useState('');

    const handleVerify = (e) => {
        e.preventDefault();
        setError('');

        const orders = getAllOrders();
        const order = orders.find(o => o.aoNumber === aoNum.trim());

        if (!order) {
            setError('Assessment Order Number not found. Please check and try again.');
            return;
        }
        if (!order.credentials || order.credentials.email !== email.trim() || order.credentials.password !== password) {
            setError('Invalid credentials. Please check your email and password.');
            return;
        }
        if (order.status !== 'ADMIN_CLEARED' && order.status !== 'PURCHASE_ENABLED') {
            setError('Not yet cleared for purchase. Please complete your MD consultation or message the admin for clearance.');
            return;
        }

        // Valid — store verified AO# and navigate to store
        sessionStorage.setItem('yourbetter_verified_ao', aoNum.trim());
        navigate('/store');
    };

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
            <div className="container" style={{ maxWidth: '480px', padding: '48px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div className="animate-fadeInUp" style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'rgba(166,139,91,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                    }}>
                        <Lock size={28} style={{ color: 'var(--teal-light)' }} />
                    </div>
                    <h2 className="animate-fadeInUp delay-1">Purchase Portal</h2>
                    <p className="animate-fadeInUp delay-2" style={{ color: 'var(--gray-400)', marginTop: '8px' }}>
                        Enter your credentials and Assessment Order Number to access your approved products.
                    </p>
                </div>

                <form onSubmit={handleVerify}>
                    <div className="glass-card animate-fadeInUp delay-2" style={{ padding: '32px' }}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                className="form-input"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="juan@email.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                className="form-input"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Your generated password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Assessment Order Number (AO#)</label>
                            <input
                                className="form-input"
                                value={aoNum}
                                onChange={e => setAoNum(e.target.value)}
                                placeholder="AO-20260217-XXXX"
                                required
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: '12px 16px',
                                background: 'rgba(196,91,74,0.1)',
                                border: '1px solid rgba(196,91,74,0.2)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--error)',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                marginBottom: '16px',
                            }}>
                                <AlertCircle size={18} style={{ minWidth: 18, marginTop: 1 }} />
                                {error}
                            </div>
                        )}

                        <button className="btn btn-primary btn-block" type="submit">
                            <ShieldCheck size={18} /> Verify & Access Store <ArrowRight size={18} />
                        </button>
                    </div>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '24px' }}>
                    Don't have access? <a href="/terms" style={{ color: 'var(--teal-light)' }}>Start your assessment</a>
                </p>
            </div>
        </div>
    );
}
