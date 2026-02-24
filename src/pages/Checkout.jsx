import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, updateOrderInStorage } from '../context/AssessmentContext';
import { CreditCard, Truck, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [aoNum, setAoNum] = useState('');
    const [form, setForm] = useState({
        fullName: '', address: '', city: '', province: '', zip: '', phone: '', notes: '',
    });

    useEffect(() => {
        const ao = sessionStorage.getItem('yourbetter_verified_ao');
        const c = sessionStorage.getItem('yourbetter_cart');
        if (!ao || !c) { navigate('/verify'); return; }
        setAoNum(ao);
        setCart(JSON.parse(c));
    }, [navigate]);

    const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    const up = (f, v) => setForm(p => ({ ...p, [f]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
        const newOrder = {
            orderId,
            items: cart,
            total,
            shipping: form,
            status: 'Processing',
            date: new Date().toISOString(),
        };

        // Save order to the AO record
        const all = getAllOrders();
        const ao = all.find(o => o.aoNumber === aoNum);
        if (ao) {
            const orders = ao.orders || [];
            orders.push(newOrder);
            updateOrderInStorage(aoNum, { orders, status: 'PURCHASE_ENABLED' });
        }

        sessionStorage.removeItem('yourbetter_cart');
        sessionStorage.setItem('yourbetter_last_order', JSON.stringify(newOrder));
        navigate('/orders');
    };

    if (!cart.length) return null;

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="badge badge-gold animate-fadeInUp" style={{ marginBottom: '16px' }}>
                        <CreditCard size={12} style={{ marginRight: '4px' }} /> Secure Checkout
                    </div>
                    <h1 className="animate-fadeInUp delay-1">Checkout</h1>
                    <p className="animate-fadeInUp delay-2">Complete your order for {aoNum}</p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '900px', padding: '32px 24px 64px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
                        {/* Shipping */}
                        <div>
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Truck size={20} style={{ color: 'var(--teal-light)' }} />
                                Shipping Information
                            </h3>
                            <div className="glass-card" style={{ padding: '28px' }}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input className="form-input" value={form.fullName} onChange={e => up('fullName', e.target.value)} required placeholder="Juan Dela Cruz" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Delivery Address</label>
                                    <textarea className="form-textarea" value={form.address} onChange={e => up('address', e.target.value)} required placeholder="House/Unit #, Street, Barangay" style={{ minHeight: '80px' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input className="form-input" value={form.city} onChange={e => up('city', e.target.value)} required placeholder="Manila" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Province</label>
                                        <input className="form-input" value={form.province} onChange={e => up('province', e.target.value)} required placeholder="Metro Manila" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label className="form-label">ZIP Code</label>
                                        <input className="form-input" value={form.zip} onChange={e => up('zip', e.target.value)} required placeholder="1000" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <input className="form-input" value={form.phone} onChange={e => up('phone', e.target.value)} required placeholder="0917 XXX XXXX" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Order Notes (optional)</label>
                                    <input className="form-input" value={form.notes} onChange={e => up('notes', e.target.value)} placeholder="Special delivery instructions..." />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={20} style={{ color: 'var(--gold)' }} />
                                Order Summary
                            </h3>
                            <div className="glass-card" style={{ padding: '28px', position: 'sticky', top: '100px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                    {cart.map(c => (
                                        <div key={c.id + c.size} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '12px',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: 'var(--radius-md)',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '1.3rem' }}>{c.image}</span>
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</p>
                                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{c.size} × {c.qty}</p>
                                                </div>
                                            </div>
                                            <span style={{ fontWeight: 600 }}>₱{(c.price * c.qty).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'var(--gray-400)' }}>Subtotal</span>
                                        <span>₱{total.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'var(--gray-400)' }}>Shipping</span>
                                        <span style={{ color: 'var(--success)' }}>Free</span>
                                    </div>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        borderTop: '1px solid var(--glass-border)',
                                        paddingTop: '16px', marginTop: '8px',
                                    }}>
                                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                        <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--gold-light)' }}>₱{total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button className="btn btn-gold btn-block" type="submit" style={{ marginTop: '24px' }}>
                                    Place Order <ArrowRight size={18} />
                                </button>

                                <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem', textAlign: 'center', marginTop: '12px' }}>
                                    Payment instructions will be sent after order confirmation.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
