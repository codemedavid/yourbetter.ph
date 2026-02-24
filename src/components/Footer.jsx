import { Link } from 'react-router-dom';
import { Shield, Mail, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3 style={{ fontSize: '1.4rem' }}>
                            Your<span style={{ color: 'var(--teal-light)' }}>Better</span>.PH
                        </h3>
                        <p>
                            A medically supervised peptide therapy program in the Philippines.
                            All protocols are reviewed and approved by licensed physicians.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: 'var(--teal-light)', fontSize: '0.85rem' }}>
                            <Shield size={16} />
                            <span>MD-led • Pharmaceutical-grade • Verified COA</span>
                        </div>
                    </div>

                    <div>
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/terms">Start Assessment</Link></li>
                            <li><Link to="/book-md">Book MD</Link></li>
                            <li><Link to="/verify">Purchase Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Program</h4>
                        <ul className="footer-links">
                            <li><a href="#how-it-works">How It Works</a></li>
                            <li><a href="#safety">Safety</a></li>
                            <li><a href="#faqs">FAQs</a></li>
                            <li><Link to="/terms">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Contact</h4>
                        <ul className="footer-links">
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={14} />
                                <a href="mailto:hello@yourbetter.ph">hello@yourbetter.ph</a>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Phone size={14} />
                                <a href="tel:+639271234567">0927 123 4567</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} YourBetter.PH — All rights reserved. This is not medical advice. Always consult a licensed physician.</p>
                </div>
            </div>
        </footer>
    );
}
