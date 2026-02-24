import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../context/AssessmentContext';
import { Package, Clock, CheckCircle2, Truck, ArrowLeft } from 'lucide-react';

const statusColors = {
    Processing: { bg: 'rgba(212,160,60,0.12)', color: 'var(--warning)', icon: <Clock size={16} /> },
    Shipped: { bg: 'rgba(122,155,191,0.12)', color: 'var(--info)', icon: <Truck size={16} /> },
    Delivered: { bg: 'rgba(107,143,86,0.12)', color: 'var(--success)', icon: <CheckCircle2 size={16} /> },
};

export default function Orders() {
    const navigate = useNavigate();
    const [aoNum, setAoNum] = useState('');
    const [orders, setOrders] = useState([]);
    const [lastOrder, setLastOrder] = useState(null);

    useEffect(() => {
        const ao = sessionStorage.getItem('yourbetter_verified_ao');
        if (!ao) { navigate('/verify'); return; }
        setAoNum(ao);

        const all = getAllOrders();
        const found = all.find(o => o.aoNumber === ao);
        if (found?.orders) setOrders(found.orders);

        const last = sessionStorage.getItem('yourbetter_last_order');
        if (last) {
            setLastOrder(JSON.parse(last));
            sessionStorage.removeItem('yourbetter_last_order');
        }
    }, [navigate]);

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="badge badge-teal animate-fadeInUp" style={{ marginBottom: '16px' }}>
                        <Package size={12} style={{ marginRight: '4px' }} /> Order Tracking
                    </div>
                    <h1 className="animate-fadeInUp delay-1">Your Orders</h1>
                    <p className="animate-fadeInUp delay-2">Assessment Order: {aoNum}</p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '800px', padding: '32px 24px 64px' }}>
                {/* Success banner */}
                {lastOrder && (
                    <div className="glass-card animate-fadeInUp" style={{
                        padding: '24px',
                        marginBottom: '32px',
                        borderLeft: '4px solid var(--success)',
                        background: 'rgba(107,143,86,0.06)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <CheckCircle2 size={24} style={{ color: 'var(--success)' }} />
                            <h3 style={{ fontSize: '1.1rem' }}>Order Placed Successfully!</h3>
                        </div>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                            Order <strong style={{ color: 'var(--white)' }}>{lastOrder.orderId}</strong> has been placed. Payment instructions will be sent shortly. Total: <strong style={{ color: 'var(--gold-light)' }}>₱{lastOrder.total.toLocaleString()}</strong>
                        </p>
                    </div>
                )}

                {orders.length === 0 && !lastOrder ? (
                    <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <Package size={48} style={{ color: 'var(--gray-600)', marginBottom: '16px' }} />
                        <h3 style={{ color: 'var(--gray-500)', marginBottom: '8px' }}>No Orders Yet</h3>
                        <p style={{ color: 'var(--gray-600)' }}>Your order history will appear here.</p>
                        <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/store')}>
                            Go to Store
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map((order, i) => {
                            const sc = statusColors[order.status] || statusColors.Processing;
                            return (
                                <div key={order.orderId || i} className="glass-card animate-fadeInUp" style={{
                                    padding: '24px',
                                    animationDelay: `${i * 0.1}s`,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                                        <div>
                                            <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Order ID</p>
                                            <h4 style={{ fontSize: '1rem' }}>{order.orderId}</h4>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                padding: '6px 14px',
                                                background: sc.bg,
                                                color: sc.color,
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                            }}>
                                                {sc.icon} {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                                        {order.items?.map((item, j) => (
                                            <div key={j} style={{
                                                display: 'flex', justifyContent: 'space-between',
                                                padding: '8px 12px',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.9rem',
                                            }}>
                                                <span>{item.image} {item.name} ({item.size}) × {item.qty}</span>
                                                <span style={{ fontWeight: 600 }}>₱{(item.price * item.qty).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                                        <span style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>
                                            {order.date ? new Date(order.date).toLocaleDateString('en-PH', { dateStyle: 'medium' }) : ''}
                                        </span>
                                        <span style={{ fontWeight: 700, color: 'var(--gold-light)' }}>₱{order.total?.toLocaleString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button className="btn btn-ghost" onClick={() => navigate('/store')}>
                        <ArrowLeft size={18} /> Back to Store
                    </button>
                </div>
            </div>
        </div>
    );
}
