import { useState } from 'react';
import { getPaymentMethods, savePaymentMethods } from '../../context/AssessmentContext';
import {
    Plus, Edit3, Trash2, ToggleLeft, ToggleRight,
    CreditCard, X, Save, CheckCircle2, QrCode,
} from 'lucide-react';

const emptyMethod = {
    id: '',
    name: '',
    accountName: '',
    accountNumber: '',
    instructions: '',
    qrCodeUrl: '',
    enabled: true,
};

export default function AdminPayments() {
    const [methods, setMethods] = useState(() => getPaymentMethods());
    const [editing, setEditing] = useState(null); // null = closed, object = editing
    const [saveMsg, setSaveMsg] = useState('');

    const persist = (updated) => {
        setMethods(updated);
        savePaymentMethods(updated);
    };

    const openNew = () => setEditing({ ...emptyMethod, id: 'pm-' + Date.now() });
    const openEdit = (m) => setEditing({ ...m });
    const closeModal = () => setEditing(null);

    const toggleEnabled = (id) => {
        persist(methods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this payment method?')) return;
        persist(methods.filter(m => m.id !== id));
    };

    const handleSave = () => {
        if (!editing.name.trim()) return;
        const exists = methods.find(m => m.id === editing.id);
        if (exists) {
            persist(methods.map(m => m.id === editing.id ? editing : m));
        } else {
            persist([...methods, editing]);
        }
        setEditing(null);
        setSaveMsg('Payment method saved!');
        setTimeout(() => setSaveMsg(''), 3000);
    };

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem' }}>Payment Methods</h2>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '2px' }}>Manage payment options for checkout</p>
                </div>
                <button className="btn btn-gold btn-sm" onClick={openNew}>
                    <Plus size={16} /> Add Method
                </button>
            </div>

            {saveMsg && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(107,143,86,0.1)', border: '1px solid rgba(107,143,86,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} /> {saveMsg}
                </div>
            )}

            {methods.length === 0 ? (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <CreditCard size={32} style={{ color: 'var(--gray-600)', marginBottom: '12px' }} />
                    <p style={{ color: 'var(--gray-500)', marginBottom: '16px' }}>No payment methods configured</p>
                    <button className="btn btn-gold btn-sm" onClick={openNew}><Plus size={16} /> Add First Method</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {methods.map(m => (
                        <div key={m.id} className="glass-card" style={{ padding: '16px 20px', opacity: m.enabled ? 1 : 0.5 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                        <CreditCard size={18} style={{ color: 'var(--teal-light)' }} />
                                        <h4 style={{ fontSize: '0.95rem' }}>{m.name}</h4>
                                        <span className={`badge ${m.enabled ? 'badge-success' : 'badge-warning'}`}>
                                            {m.enabled ? 'Active' : 'Disabled'}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                                        {m.accountName}{m.accountNumber ? ` • ${m.accountNumber}` : ''}
                                    </p>
                                    {m.instructions && (
                                        <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem', marginTop: '4px', fontStyle: 'italic' }}>
                                            {m.instructions.substring(0, 100)}{m.instructions.length > 100 ? '...' : ''}
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button className="btn btn-outline btn-sm" onClick={() => toggleEnabled(m.id)} title={m.enabled ? 'Disable' : 'Enable'}>
                                        {m.enabled ? <ToggleRight size={18} style={{ color: 'var(--success)' }} /> : <ToggleLeft size={18} />}
                                    </button>
                                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(m)}><Edit3 size={16} /></button>
                                    <button className="btn btn-outline btn-sm" onClick={() => handleDelete(m.id)} style={{ color: 'var(--error)' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {editing && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px',
                }} onClick={closeModal}>
                    <div className="glass-card animate-fadeIn" style={{ maxWidth: '500px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>{methods.find(m => m.id === editing.id) ? 'Edit' : 'Add'} Payment Method</h3>
                            <button className="btn btn-outline btn-sm" onClick={closeModal}><X size={16} /></button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Method Name *</label>
                            <input className="form-input" value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                                placeholder="e.g., GCash, BDO Bank Transfer" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Account Name</label>
                            <input className="form-input" value={editing.accountName} onChange={e => setEditing(p => ({ ...p, accountName: e.target.value }))}
                                placeholder="e.g., BetterYOU.PH Inc." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Account Number</label>
                            <input className="form-input" value={editing.accountNumber} onChange={e => setEditing(p => ({ ...p, accountNumber: e.target.value }))}
                                placeholder="e.g., 0917-xxx-xxxx" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Instructions</label>
                            <textarea className="form-textarea" value={editing.instructions} onChange={e => setEditing(p => ({ ...p, instructions: e.target.value }))}
                                placeholder="Payment instructions for customers..." style={{ minHeight: '80px' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label"><QrCode size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />QR Code URL</label>
                            <input className="form-input" value={editing.qrCodeUrl} onChange={e => setEditing(p => ({ ...p, qrCodeUrl: e.target.value }))}
                                placeholder="https://example.com/qr.png" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className={editing.enabled ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                                    onClick={() => setEditing(p => ({ ...p, enabled: true }))}>
                                    <CheckCircle2 size={14} /> Enabled
                                </button>
                                <button className={!editing.enabled ? 'btn btn-outline btn-sm' : 'btn btn-outline btn-sm'}
                                    onClick={() => setEditing(p => ({ ...p, enabled: false }))} style={{ opacity: !editing.enabled ? 1 : 0.6 }}>
                                    <X size={14} /> Disabled
                                </button>
                            </div>
                        </div>
                        <button className="btn btn-gold btn-block" onClick={handleSave} style={{ marginTop: '8px' }}>
                            <Save size={18} /> Save Payment Method
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
