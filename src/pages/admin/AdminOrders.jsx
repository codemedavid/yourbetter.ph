import { useState } from 'react';
import { getAllOrders, getAllAggregatedOrders, updateOrderInStorage } from '../../context/AssessmentContext';
import { getProducts } from '../../context/AssessmentContext';
import peptides from '../../data/peptides';
import {
    Search, ShoppingBag, ExternalLink, Package as PackageIcon,
    ChevronDown, ChevronUp, Clock, Truck, CheckCircle2, MapPin,
} from 'lucide-react';

export default function AdminOrders({ onNavigateToAssessment }) {
    const [allOrders, setAllOrders] = useState(() => getAllAggregatedOrders());
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(null);

    const refresh = () => setAllOrders(getAllAggregatedOrders());

    const filtered = allOrders.filter(o =>
        o.aoNumber?.toLowerCase().includes(search.toLowerCase()) ||
        o.id?.toLowerCase().includes(search.toLowerCase()) ||
        o.assessmentEmail?.toLowerCase().includes(search.toLowerCase())
    );

    const updateOrderStatus = (aoNumber, orderIdx, newStatus) => {
        const allAssessments = getAllOrders();
        const assessment = allAssessments.find(a => a.aoNumber === aoNumber);
        if (assessment && assessment.orders && assessment.orders[orderIdx]) {
            assessment.orders[orderIdx].status = newStatus;
            updateOrderInStorage(aoNumber, { orders: assessment.orders });
            refresh();
        }
    };

    const statusIcon = (status) => {
        switch (status) {
            case 'Processing': return <Clock size={14} style={{ color: 'var(--gold)' }} />;
            case 'Shipped': return <Truck size={14} style={{ color: 'var(--teal-light)' }} />;
            case 'Delivered': return <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />;
            default: return <Clock size={14} style={{ color: 'var(--gray-500)' }} />;
        }
    };

    const statusBadgeCls = (status) => {
        switch (status) {
            case 'Processing': return 'badge-gold';
            case 'Shipped': return 'badge-teal';
            case 'Delivered': return 'badge-success';
            default: return 'badge-warning';
        }
    };

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem' }}>Manage Orders</h2>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '2px' }}>{allOrders.length} total orders</p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={refresh}>Refresh</button>
            </div>

            <div style={{ marginBottom: '16px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by order ID, AO#, or email..." style={{ paddingLeft: '44px' }} />
            </div>

            {filtered.length === 0 ? (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <ShoppingBag size={32} style={{ color: 'var(--gray-600)', marginBottom: '12px' }} />
                    <p style={{ color: 'var(--gray-500)' }}>No orders found</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filtered.map((order, i) => {
                        const isExpanded = expanded === i;
                        return (
                            <div key={i} className="glass-card" style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: '8px' }}
                                    onClick={() => setExpanded(isExpanded ? null : i)}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                            <h4 style={{ fontSize: '0.95rem' }}>{order.id || `Order #${i + 1}`}</h4>
                                            <span className={`badge ${statusBadgeCls(order.status)}`}>
                                                {statusIcon(order.status)} {order.status || 'Pending'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                                            <span
                                                style={{ color: 'var(--teal-light)', cursor: 'pointer', textDecoration: 'underline' }}
                                                onClick={(e) => { e.stopPropagation(); onNavigateToAssessment && onNavigateToAssessment(order.aoNumber); }}
                                            >
                                                {order.aoNumber} <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                                            </span>
                                            <span>{order.assessmentEmail}</span>
                                            {order.date && <span>{order.date}</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '0.95rem' }}>₱{order.total?.toLocaleString() || '0'}</span>
                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        {/* Items */}
                                        {order.items && order.items.length > 0 && (
                                            <div style={{ marginBottom: '16px' }}>
                                                <h5 style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginBottom: '8px' }}>Items</h5>
                                                {order.items.map((item, j) => (
                                                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', marginBottom: '4px', fontSize: '0.85rem' }}>
                                                        <span>{item.name} {item.size ? `(${item.size})` : ''} × {item.qty || 1}</span>
                                                        <span style={{ color: 'var(--gold)' }}>₱{(item.price * (item.qty || 1)).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Shipping */}
                                        {order.shipping && (
                                            <div style={{ marginBottom: '16px' }}>
                                                <h5 style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginBottom: '8px' }}>
                                                    <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Shipping
                                                </h5>
                                                <div style={{ fontSize: '0.85rem', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                                                    <p>{order.shipping.name}</p>
                                                    <p style={{ color: 'var(--gray-500)' }}>{order.shipping.address}, {order.shipping.city} {order.shipping.zip}</p>
                                                    <p style={{ color: 'var(--gray-500)' }}>{order.shipping.phone}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Status Controls */}
                                        <div>
                                            <h5 style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginBottom: '8px' }}>Update Status</h5>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {['Pending', 'Processing', 'Shipped', 'Delivered'].map(s => (
                                                    <button key={s}
                                                        className={(order.status || 'Pending') === s ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                                                        onClick={() => {
                                                            // find the original index within the assessment
                                                            const allAssessments = getAllOrders();
                                                            const assessment = allAssessments.find(a => a.aoNumber === order.aoNumber);
                                                            if (assessment) {
                                                                const idx = assessment.orders?.findIndex(o => o.id === order.id);
                                                                if (idx >= 0) updateOrderStatus(order.aoNumber, idx, s);
                                                            }
                                                        }}
                                                        style={{ fontSize: '0.8rem' }}
                                                    >
                                                        {statusIcon(s)} {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
