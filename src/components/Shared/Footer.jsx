import { Link, NavLink } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

import AppOrbitLogo from './AppOrbitLogo';

const Footer = () => {
    return (
        // footer p-10 bg-neutral text-neutral-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8
        <footer className="footer p-10 bg-base-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <aside className="text-center md:text-left lg:col-span-2">
                {/* Logo/Website Name */ }
                <Link to="/" className="text-2xl font-bold text-primary">
                    <AppOrbitLogo className="text-2xl font-bold mx-auto md:mx-0" />
                </Link>
                <p className='mt-2 max-w-sm mx-auto md:mx-0'>
                    AppOrbit Ltd. <br />
                    Providing reliable tech product discovery since 2024
                </p>
                <p className="mt-2 text-sm"> Copyright &copy; { new Date().getFullYear() } AppOrbit. All rights reserved.</p>
            </aside>

            {/* service section */ }
            <nav>
                <h6 className="footer-title">Service</h6>
                <NavLink
                    to="/"
                    className={ ( { isActive } ) => isActive ? "link link-hover font-bold text-primary" : "link link-hover" }
                    end
                >
                    Home
                </NavLink>
                <NavLink
                    to="/products"
                    className={ ( { isActive } ) => isActive ? "link link-hover font-bold text-primary" : "link link-hover" }
                    end
                >
                    Products
                </NavLink>

                <Link to="/dashboard/add-product" className="link link-hover">Add Product</Link>
                <Link to="/dashboard" className="link link-hover">Dashboard</Link>
            </nav>

            {/* company section */ }
            <nav>
                <h6 className="footer-title">
                    Company</h6>
                {/* Useful links */ }
                <NavLink
                    to="/about"
                    className={ ( { isActive } ) => isActive ? "link link-hover font-bold text-primary" : "link link-hover" }
                    end
                >
                    About Us
                </NavLink>

                <NavLink
                    to="/contact"
                    className={ ( { isActive } ) => isActive ? "link link-hover font-bold text-primary" : "link link-hover" }
                >
                    Contact
                </NavLink>

                <NavLink
                    to="/privacy-policy"
                    className={ ( { isActive } ) => isActive ? "link link-hover font-bold text-primary" : "link link-hover" }
                >
                    Privacy Policy
                </NavLink>

                <NavLink
                    to="/terms-of-service"
                    className={ ( { isActive } ) => isActive ? "link link-hover font-bold text-primary" : "link link-hover" }
                >
                    Terms of Service
                </NavLink>
            </nav>

            {/* social media section */ }
            <nav>
                <h6 className="footer-title">Stay connected with us</h6>
                <div className="grid grid-flow-col gap-4">
                    {/* Facebook Link */ }
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="btn btn-ghost btn-circle">
                        <FaFacebookF className="text-2xl" />
                    </a>
                    {/* Twitter Link */ }
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="btn btn-ghost btn-circle">
                        <FaTwitter className="text-2xl" />
                    </a>
                    {/* Instagram Link */ }
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="btn btn-ghost btn-circle">
                        <FaInstagram className="text-2xl" />
                    </a>
                    {/* LinkedIn Link */ }
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="btn btn-ghost btn-circle">
                        <FaLinkedinIn className="text-2xl" />
                    </a>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;