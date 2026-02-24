import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../context/AssessmentContext';
import peptides from '../data/peptides';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Package } from 'lucide-react';

export default function Store() {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        const aoNum = sessionStorage.getItem('yourbetter_verified_ao');
        if (!aoNum) { navigate('/verify'); return; }
        const all = getAllOrders();
        const found = all.find(o => o.aoNumber === aoNum);
        if (!found || (found.status !== 'ADMIN_CLEARED' && found.status !== 'PURCHASE_ENABLED')) {
            navigate('/verify');
            return;
        }
        setOrder(found);
    }, [navigate]);

    if (!order) return null;

    const allowed = order.allowedProducts?.length
        ? peptides.filter(p => order.allowedProducts.includes(p.id))
        : peptides.filter(p => order.recommendations?.includes(p.id));

    const addToCart = (product, size) => {
        setCart(prev => {
            const existing = prev.find(c => c.id === product.id && c.size === size);
            if (existing) return prev.map(c => c.id === product.id && c.size === size ? { ...c, qty: c.qty + 1 } : c);
            return [...prev, { id: product.id, name: product.name, price: product.price, size, qty: 1, image: product.image }];
        });
        setCartOpen(true);
    };

    const updateQty = (id, size, delta) => {
        setCart(prev => prev.map(c => {
            if (c.id === id && c.size === size) {
                const q = c.qty + delta;
                return q > 0 ? { ...c, qty: q } : c;
            }
            return c;
        }).filter(c => c.qty > 0));
    };

    const removeItem = (id, size) => setCart(prev => prev.filter(c => !(c.id === id && c.size === size)));

    const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

    const handleCheckout = () => {
        sessionStorage.setItem('yourbetter_cart', JSON.stringify(cart));
        navigate('/checkout');
    };

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="badge badge-gold animate-fadeInUp" style={{ marginBottom: '16px' }}>
                        <Package size={12} style={{ marginRight: '4px' }} /> Approved Products
                    </div>
                    <h1 className="animate-fadeInUp delay-1">Your Store</h1>
                    <p className="animate-fadeInUp delay-2">Order #{order.aoNumber} — These products have been approved for you</p>
                </div>
            </div>

            <div className="container" style={{ padding: '32px 24px 64px' }}>
                {/* Cart button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                    <button className="btn btn-outline" onClick={() => setCartOpen(!cartOpen)} style={{ position: 'relative' }}>
                        <ShoppingCart size={18} /> Cart
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-8px', right: '-8px',
                                background: 'var(--teal)', color: 'white',
                                width: '22px', height: '22px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 700,
                            }}>{cartCount}</span>
                        )}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: cartOpen ? '1fr 340px' : '1fr', gap: '32px' }}>
                    {/* Products */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px',
                    }}>
                        {allowed.map((p, i) => (
                            <ProductCard key={p.id} product={p} onAdd={addToCart} delay={i * 0.1} />
                        ))}
                    </div>

                    {/* Cart sidebar */}
                    {cartOpen && (
                        <div className="glass-card animate-slideInRight" style={{
                            padding: '24px',
                            height: 'fit-content',
                            position: 'sticky',
                            top: '100px',
                        }}>
                            <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShoppingCart size={18} style={{ color: 'var(--teal-light)' }} />
                                Shopping Cart ({cartCount})
                            </h4>

                            {cart.length === 0 ? (
                                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Your cart is empty</p>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                        {cart.map(c => (
                                            <div key={c.id + c.size} style={{
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                padding: '12px',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: 'var(--radius-md)',
                                            }}>
                                                <span style={{ fontSize: '1.5rem' }}>{c.image}</span>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.name}</p>
                                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{c.size}</p>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => updateQty(c.id, c.size, -1)}><Minus size={14} /></button>
                                                    <span style={{ fontWeight: 600, width: '20px', textAlign: 'center' }}>{c.qty}</span>
                                                    <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => updateQty(c.id, c.size, 1)}><Plus size={14} /></button>
                                                    <button className="btn btn-ghost" style={{ padding: '4px', color: 'var(--error)' }} onClick={() => removeItem(c.id, c.size)}><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{
                                        borderTop: '1px solid var(--glass-border)',
                                        paddingTop: '16px',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <span style={{ color: 'var(--gray-400)' }}>Total</span>
                                            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--gold-light)' }}>₱{total.toLocaleString()}</span>
                                        </div>
                                        <button className="btn btn-gold btn-block" onClick={handleCheckout}>
                                            Checkout <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductCard({ product, onAdd, delay }) {
    const [size, setSize] = useState(product.sizes[0]);

    return (
        <div className="glass-card animate-fadeInUp" style={{
            padding: '28px',
            animationDelay: `${delay}s`,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '2.5rem' }}>{product.image}</span>
                <span className="badge badge-teal">{product.category}</span>
            </div>
            <h4 style={{ marginBottom: '6px' }}>{product.name}</h4>
            <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px', flex: 1 }}>
                {product.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {product.benefits.slice(0, 3).map((b, j) => (
                    <span key={j} style={{
                        padding: '3px 10px',
                        background: 'rgba(166,139,91,0.1)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.7rem',
                        color: 'var(--teal-light)',
                    }}>{b}</span>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold-light)', fontFamily: 'var(--font-heading)' }}>
                    ₱{product.price.toLocaleString()}
                </span>
                <select
                    className="form-select"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    style={{ width: 'auto', padding: '8px 32px 8px 12px', fontSize: '0.85rem' }}
                >
                    {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <button className="btn btn-primary btn-block btn-sm" onClick={() => onAdd(product, size)}>
                <Plus size={16} /> Add to Cart
            </button>
        </div>
    );
}
