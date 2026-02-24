import { useState } from 'react';
import { getAllOrders, updateOrderInStorage } from '../../context/AssessmentContext';
import { getProducts } from '../../context/AssessmentContext';
import peptides from '../../data/peptides';
import {
    Search, ChevronRight, CheckCircle2, XCircle, Clock,
    Save, ClipboardCheck, Package, User, Mail, Calendar,
    Stethoscope, ShoppingBag, ArrowLeft,
} from 'lucide-react';

export default function AdminAssessments({ onNavigateToOrder }) {
    const [orders, setOrders] = useState(() => getAllOrders());
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [saveMsg, setSaveMsg] = useState('');

    const refresh = () => setOrders(getAllOrders());

    const allProducts = (() => {
        const stored = getProducts();
        return stored || peptides;
    })();

    const filtered = orders.filter(o =>
        o.aoNumber?.toLowerCase().includes(search.toLowerCase()) ||
        o.assessmentAnswers?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        o.assessmentAnswers?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        o.assessmentAnswers?.email?.toLowerCase().includes(search.toLowerCase())
    );

    const selectOrder = (o) => {
        setSelected(o);
        setEditForm({
            mdApproved: o.status === 'MD_APPROVED' || o.status === 'ADMIN_CLEARED' || o.status === 'PURCHASE_ENABLED' ? 'yes' : o.status === 'BOOKED' ? 'pending' : 'no',
            adminCleared: o.status === 'ADMIN_CLEARED' || o.status === 'PURCHASE_ENABLED' ? 'yes' : 'no',
            allowedProducts: o.allowedProducts?.length ? o.allowedProducts : (o.recommendations || []),
            mdNotes: o.mdNotes || '',
        });
        setSaveMsg('');
    };

    const handleSave = () => {
        if (!selected || !editForm) return;
        let newStatus = selected.status;
        if (editForm.adminCleared === 'yes') newStatus = 'ADMIN_CLEARED';
        else if (editForm.mdApproved === 'yes') newStatus = 'MD_APPROVED';
        else if (editForm.mdApproved === 'pending' && selected.booking) newStatus = 'BOOKED';

        updateOrderInStorage(selected.aoNumber, {
            status: newStatus,
            allowedProducts: editForm.allowedProducts,
            mdNotes: editForm.mdNotes,
        });
        refresh();
        setSelected(prev => ({ ...prev, status: newStatus, allowedProducts: editForm.allowedProducts, mdNotes: editForm.mdNotes }));
        setSaveMsg('Saved!');
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const toggleProduct = (id) => {
        setEditForm(p => ({
            ...p,
            allowedProducts: p.allowedProducts.includes(id)
                ? p.allowedProducts.filter(x => x !== id)
                : [...p.allowedProducts, id],
        }));
    };

    const statusBadge = (status) => {
        const map = {
            CREATED: { cls: 'badge-warning', label: 'Created' },
            ASSESSED: { cls: 'badge-warning', label: 'Assessed' },
            RECOMMENDED: { cls: 'badge-teal', label: 'Recommended' },
            BOOKED: { cls: 'badge-gold', label: 'Booked' },
            MD_APPROVED: { cls: 'badge-teal', label: 'MD Approved' },
            ADMIN_CLEARED: { cls: 'badge-success', label: 'Cleared' },
            PURCHASE_ENABLED: { cls: 'badge-success', label: 'Purchase Enabled' },
        };
        const s = map[status] || { cls: 'badge-warning', label: status };
        return <span className={`badge ${s.cls}`}>{s.label}</span>;
    };

    // === PROFILE VIEW ===
    if (selected && editForm) {
        return (
            <div className="animate-fadeIn">
                <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)} style={{ marginBottom: '20px' }}>
                    <ArrowLeft size={16} /> Back to Assessments
                </button>

                {/* Header */}
                <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{selected.aoNumber}</h3>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                                {selected.assessmentAnswers?.firstName} {selected.assessmentAnswers?.lastName} • {selected.assessmentAnswers?.email}
                            </p>
                        </div>
                        {statusBadge(selected.status)}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* User Details */}
                        <div className="glass-card" style={{ padding: '20px 24px' }}>
                            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                                <User size={16} style={{ color: 'var(--teal-light)' }} /> User Details
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ color: 'var(--gray-500)' }}>Name: </span>
                                    <span>{selected.assessmentAnswers?.firstName} {selected.assessmentAnswers?.lastName}</span>
                                </div>
                                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ color: 'var(--gray-500)' }}>Email: </span>
                                    <span>{selected.assessmentAnswers?.email}</span>
                                </div>
                                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ color: 'var(--gray-500)' }}>Age: </span>
                                    <span>{selected.assessmentAnswers?.age || '—'}</span>
                                </div>
                                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ color: 'var(--gray-500)' }}>Sex: </span>
                                    <span>{selected.assessmentAnswers?.sex || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Assessment Answers */}
                        <div className="glass-card" style={{ padding: '20px 24px' }}>
                            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                                <ClipboardCheck size={16} style={{ color: 'var(--teal-light)' }} /> Assessment Answers
                            </h4>
                            {selected.assessmentAnswers ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', fontSize: '0.85rem' }}>
                                    {Object.entries(selected.assessmentAnswers).filter(([k]) => !['firstName', 'lastName', 'email', 'age', 'sex'].includes(k)).map(([k, v]) => (
                                        <div key={k} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                                            <span style={{ color: 'var(--gray-500)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}: </span>
                                            <span style={{ color: 'var(--gray-300)' }}>{Array.isArray(v) ? v.join(', ') : String(v) || '—'}</span>
                                        </div>
                                    ))}
                                    {Object.entries(selected.assessmentAnswers).filter(([k]) => !['firstName', 'lastName', 'email', 'age', 'sex'].includes(k)).length === 0 && (
                                        <p style={{ color: 'var(--gray-500)' }}>No additional answers recorded</p>
                                    )}
                                </div>
                            ) : <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>No assessment data</p>}
                        </div>

                        {/* Recommendations */}
                        <div className="glass-card" style={{ padding: '20px 24px' }}>
                            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                                <Package size={16} style={{ color: 'var(--gold)' }} /> Recommended Products
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {(selected.recommendations || []).map(id => {
                                    const p = allProducts.find(x => x.id === id);
                                    return p ? <span key={id} className="badge badge-teal">{p.image} {p.name}</span> : null;
                                })}
                                {(!selected.recommendations || selected.recommendations.length === 0) && (
                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>None</p>
                                )}
                            </div>
                        </div>

                        {/* Booking */}
                        {selected.booking && (
                            <div className="glass-card" style={{ padding: '20px 24px' }}>
                                <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                                    <Stethoscope size={16} style={{ color: 'var(--teal-light)' }} /> MD Booking
                                </h4>
                                <div style={{ fontSize: '0.85rem', display: 'grid', gap: '6px' }}>
                                    <p><span style={{ color: 'var(--gray-500)' }}>Doctor:</span> {selected.booking.doctorName}</p>
                                    <p><span style={{ color: 'var(--gray-500)' }}>Date:</span> {selected.booking.date}</p>
                                    <p><span style={{ color: 'var(--gray-500)' }}>Time:</span> {selected.booking.time}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Status Controls */}
                        <div className="glass-card" style={{ padding: '20px 24px' }}>
                            <h4 style={{ marginBottom: '16px', fontSize: '0.95rem' }}>Status Controls</h4>

                            <div className="form-group">
                                <label className="form-label">MD Approved</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['yes', 'no', 'pending'].map(v => (
                                        <button key={v} className={editForm.mdApproved === v ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                                            onClick={() => setEditForm(p => ({ ...p, mdApproved: v }))} style={{ textTransform: 'capitalize' }}>
                                            {v === 'yes' && <CheckCircle2 size={14} />}{v === 'no' && <XCircle size={14} />}{v === 'pending' && <Clock size={14} />} {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Admin Cleared</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['yes', 'no'].map(v => (
                                        <button key={v} className={editForm.adminCleared === v ? 'btn btn-gold btn-sm' : 'btn btn-outline btn-sm'}
                                            onClick={() => setEditForm(p => ({ ...p, adminCleared: v }))} style={{ textTransform: 'capitalize' }}>
                                            {v === 'yes' ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Allowed Products</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {allProducts.map(p => (
                                        <button key={p.id} className={editForm.allowedProducts.includes(p.id) ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                                            onClick={() => toggleProduct(p.id)} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                                            {p.image} {p.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">MD Notes</label>
                                <textarea className="form-textarea" value={editForm.mdNotes}
                                    onChange={e => setEditForm(p => ({ ...p, mdNotes: e.target.value }))}
                                    placeholder="Doctor's notes..." style={{ minHeight: '80px' }} />
                            </div>

                            <button className="btn btn-gold btn-block" onClick={handleSave}>
                                <Save size={18} /> Save Changes
                            </button>

                            {saveMsg && (
                                <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(107,143,86,0.1)', border: '1px solid rgba(107,143,86,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle2 size={16} /> {saveMsg}
                                </div>
                            )}
                        </div>

                        {/* Linked Order History */}
                        <div className="glass-card" style={{ padding: '20px 24px' }}>
                            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                                <ShoppingBag size={16} style={{ color: 'var(--gold)' }} /> Order History
                            </h4>
                            {selected.orders && selected.orders.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {selected.orders.map((ord, i) => (
                                        <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: '600' }}>{ord.id || `Order #${i + 1}`}</span>
                                                <span className={`badge ${ord.status === 'Delivered' ? 'badge-success' : ord.status === 'Shipped' ? 'badge-teal' : 'badge-warning'}`}>{ord.status || 'Pending'}</span>
                                            </div>
                                            <p style={{ color: 'var(--gray-500)' }}>{ord.items?.map(it => it.name).join(', ') || 'No items'}</p>
                                            <p style={{ color: 'var(--gold)', fontWeight: '600', marginTop: '4px' }}>₱{ord.total?.toLocaleString() || '0'}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>No orders placed yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // === LIST VIEW ===
    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem' }}>Manage Assessments</h2>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '2px' }}>{orders.length} total records</p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={refresh}>Refresh</button>
            </div>

            <div style={{ marginBottom: '16px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by AO#, name, or email..." style={{ paddingLeft: '44px' }} />
            </div>

            {filtered.length === 0 ? (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <ClipboardCheck size={32} style={{ color: 'var(--gray-600)', marginBottom: '12px' }} />
                    <p style={{ color: 'var(--gray-500)' }}>No assessments found</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filtered.map(o => (
                        <div key={o.aoNumber} className="glass-card" onClick={() => selectOrder(o)}
                            style={{ padding: '16px 20px', cursor: 'pointer', transition: 'border-color 0.2s', border: '2px solid transparent' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h4 style={{ fontSize: '0.95rem' }}>{o.aoNumber}</h4>
                                        {statusBadge(o.status)}
                                    </div>
                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                                        {o.assessmentAnswers?.firstName} {o.assessmentAnswers?.lastName} • {o.assessmentAnswers?.email}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {o.orders && o.orders.length > 0 && (
                                        <span className="badge badge-gold">{o.orders.length} order{o.orders.length > 1 ? 's' : ''}</span>
                                    )}
                                    <ChevronRight size={18} style={{ color: 'var(--gray-500)' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
