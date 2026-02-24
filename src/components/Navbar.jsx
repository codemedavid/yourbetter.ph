import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setOpen(false), [location]);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <Link to="/" className="navbar-logo">
                    Your<span className="logo-accent">Better</span>.PH
                </Link>
                <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
                <ul className={`navbar-links ${open ? 'open' : ''}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/terms">Assessment</Link></li>
                    <li><Link to="/book-md">Book MD</Link></li>
                    <li><Link to="/verify">Purchase</Link></li>
                    <li><Link to="/admin" className="btn btn-sm btn-outline">Admin</Link></li>
                </ul>
            </div>
        </nav>
    );
}
