import { useState, useEffect } from 'react';
import { getProducts, saveProducts } from '../../context/AssessmentContext';
import peptidesData from '../../data/peptides';
import {
    Plus, Edit3, Trash2, ToggleLeft, ToggleRight,
    Package, X, Save, CheckCircle2, Search,
} from 'lucide-react';

export default function AdminProducts() {
    const [products, setProducts] = useState(() => {
        const stored = getProducts();
        if (stored) return stored;
        // Seed from peptides.js on first load
        const seeded = peptidesData.map(p => ({ ...p, enabled: true, stock: 100 }));
        saveProducts(seeded);
        return seeded;
    });
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(null);
    const [saveMsg, setSaveMsg] = useState('');

    const persist = (updated) => {
        setProducts(updated);
        saveProducts(updated);
    };

    const openNew = () => setEditing({
        id: 'prod-' + Date.now(),
        name: '',
        category: '',
        description: '',
        image: '💊',
        price: 0,
        sizes: [],
        benefits: [],
        enabled: true,
        stock: 100,
    });

    const openEdit = (p) => setEditing({ ...p });
    const closeModal = () => setEditing(null);

    const toggleEnabled = (id) => {
        persist(products.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this product?')) return;
        persist(products.filter(p => p.id !== id));
    };

    const handleSave = () => {
        if (!editing.name.trim()) return;
        const exists = products.find(p => p.id === editing.id);
        if (exists) {
            persist(products.map(p => p.id === editing.id ? editing : p));
        } else {
            persist([...products, editing]);
        }
        setEditing(null);
        setSaveMsg('Product saved!');
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem' }}>Manage Products</h2>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '2px' }}>{products.length} products</p>
                </div>
                <button className="btn btn-gold btn-sm" onClick={openNew}>
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {saveMsg && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(107,143,86,0.1)', border: '1px solid rgba(107,143,86,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} /> {saveMsg}
                </div>
            )}

            <div style={{ marginBottom: '16px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..." style={{ paddingLeft: '44px' }} />
            </div>

            {filtered.length === 0 ? (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <Package size={32} style={{ color: 'var(--gray-600)', marginBottom: '12px' }} />
                    <p style={{ color: 'var(--gray-500)' }}>No products found</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
                    {filtered.map(p => (
                        <div key={p.id} className="glass-card" style={{ padding: '20px', opacity: p.enabled ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{p.image}</span>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem' }}>{p.name}</h4>
                                        <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{p.category}</span>
                                    </div>
                                </div>
                                <span className={`badge ${p.enabled ? 'badge-success' : 'badge-warning'}`} style={{ height: 'fit-content' }}>
                                    {p.enabled ? 'Active' : 'Disabled'}
                                </span>
                            </div>

                            <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem', marginBottom: '12px', lineHeight: '1.5' }}>
                                {p.description?.substring(0, 100)}{p.description?.length > 100 ? '...' : ''}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '1.1rem' }}>₱{p.price?.toLocaleString()}</span>
                                <div style={{ display: 'flex', gap: '4px', fontSize: '0.75rem' }}>
                                    {(p.sizes || []).map(s => (
                                        <span key={s} style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', color: 'var(--gray-400)' }}>{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Stock: {p.stock ?? '∞'}</span>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button className="btn btn-outline btn-sm" onClick={() => toggleEnabled(p.id)} title={p.enabled ? 'Disable' : 'Enable'}>
                                        {p.enabled ? <ToggleRight size={16} style={{ color: 'var(--success)' }} /> : <ToggleLeft size={16} />}
                                    </button>
                                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}><Edit3 size={14} /></button>
                                    <button className="btn btn-outline btn-sm" onClick={() => handleDelete(p.id)} style={{ color: 'var(--error)' }}><Trash2 size={14} /></button>
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
                    <div className="glass-card animate-fadeIn" style={{ maxWidth: '560px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>{products.find(p => p.id === editing.id) ? 'Edit' : 'Add'} Product</h3>
                            <button className="btn btn-outline btn-sm" onClick={closeModal}><X size={16} /></button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Product Name *</label>
                                <input className="form-input" value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g., BPC-157" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <input className="form-input" value={editing.category} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                                    placeholder="e.g., Recovery & Healing" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Emoji / Image</label>
                                <input className="form-input" value={editing.image} onChange={e => setEditing(p => ({ ...p, image: e.target.value }))}
                                    placeholder="💊" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price (₱)</label>
                                <input className="form-input" type="number" value={editing.price} onChange={e => setEditing(p => ({ ...p, price: Number(e.target.value) }))}
                                    placeholder="8500" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Stock</label>
                                <input className="form-input" type="number" value={editing.stock ?? ''} onChange={e => setEditing(p => ({ ...p, stock: Number(e.target.value) }))}
                                    placeholder="100" />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" value={editing.description} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Product description..." style={{ minHeight: '80px' }} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Sizes (comma-separated)</label>
                                <input className="form-input" value={(editing.sizes || []).join(', ')}
                                    onChange={e => setEditing(p => ({ ...p, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                                    placeholder="5mg, 10mg" />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Benefits (comma-separated)</label>
                                <input className="form-input" value={(editing.benefits || []).join(', ')}
                                    onChange={e => setEditing(p => ({ ...p, benefits: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                                    placeholder="Tissue repair, Anti-inflammatory" />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
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
                        </div>
                        <button className="btn btn-gold btn-block" onClick={handleSave} style={{ marginTop: '8px' }}>
                            <Save size={18} /> Save Product
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
