import { useState } from 'react';
import {
    Lock, ShieldCheck, ClipboardCheck, CreditCard,
    ShoppingBag, Package, LogOut,
} from 'lucide-react';
import AdminAssessments from './admin/AdminAssessments';
import AdminPayments from './admin/AdminPayments';
import AdminOrders from './admin/AdminOrders';
import AdminProducts from './admin/AdminProducts';

const ADMIN_PASSWORD = 'betteryou2026';

const TABS = [
    { id: 'assessments', label: 'Manage Assessments', icon: ClipboardCheck, desc: 'View and manage all submitted assessments' },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard, desc: 'Manage payment options for checkout' },
    { id: 'orders', label: 'Manage Orders', icon: ShoppingBag, desc: 'View and manage all orders' },
    { id: 'products', label: 'Manage Products', icon: Package, desc: 'Add, edit, enable/disable products' },
];

export default function AdminDashboard() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [pwError, setPwError] = useState('');
    const [activeTab, setActiveTab] = useState('assessments');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setAuthenticated(true);
            setPwError('');
        } else {
            setPwError('Incorrect password');
        }
    };

    // Navigate from orders to assessment
    const handleNavigateToAssessment = (aoNumber) => {
        setActiveTab('assessments');
        // The assessment component will handle its own search
    };

    // LOGIN GATE
    if (!authenticated) {
        return (
            <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
                <div style={{ maxWidth: '400px', width: '100%', padding: '0 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: 'rgba(192,122,74,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            <Lock size={28} style={{ color: 'var(--gold)' }} />
                        </div>
                        <h2>Admin Dashboard</h2>
                        <p style={{ color: 'var(--gray-400)', marginTop: '8px' }}>Enter password to access</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="glass-card" style={{ padding: '28px' }}>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input className="form-input" type="password" value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter admin password" autoFocus />
                                {pwError && <p className="form-error">{pwError}</p>}
                            </div>
                            <button className="btn btn-gold btn-block" type="submit">
                                <ShieldCheck size={18} /> Access Dashboard
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // ADMIN DASHBOARD
    return (
        <div className="page" style={{ paddingTop: '68px' }}>
            <div className="admin-layout">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <div className="admin-sidebar-header">
                        <h3 style={{ fontSize: '1rem', color: 'var(--white)' }}>Admin Panel</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '2px' }}>BetterYOU.PH</p>
                    </div>

                    <nav className="admin-nav">
                        {TABS.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button key={tab.id}
                                    className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}>
                                    <Icon size={18} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="admin-sidebar-footer">
                        <button className="admin-nav-item" onClick={() => setAuthenticated(false)} style={{ color: 'var(--gray-500)' }}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Content */}
                <main className="admin-content">
                    {activeTab === 'assessments' && <AdminAssessments onNavigateToOrder={(aoNumber) => setActiveTab('orders')} />}
                    {activeTab === 'payments' && <AdminPayments />}
                    {activeTab === 'orders' && <AdminOrders onNavigateToAssessment={handleNavigateToAssessment} />}
                    {activeTab === 'products' && <AdminProducts />}
                </main>
            </div>
        </div>
    );
}
