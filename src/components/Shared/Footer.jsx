import React from 'react';
import { Link } from 'react-router-dom';
import AppOrbitLogo from './AppOrbitLogo';

const Footer = () => {
    return (
        <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded mt-8">
            <aside>
                {/* Logo/Website Name */ }
                <Link to="/" className="text-2xl font-bold text-primary">
                    <AppOrbitLogo />
                </Link>
                <p>
                    AppOrbit Ltd. <br />
                    Providing reliable tech product discovery since 2024
                </p>
                <p>Copyright © 2024 - All right reserved</p>
            </aside>
            <nav>
                <div className="grid grid-flow-col gap-4">
                    {/* Useful links */ }
                    <Link to="/about" className="link link-hover">About Us</Link>
                    <Link to="/contact" className="link link-hover">Contact</Link>
                    <Link to="/privacy" className="link link-hover">Privacy Policy</Link>
                    <Link to="/terms" className="link link-hover">Terms of Service</Link>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;