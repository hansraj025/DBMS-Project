import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Bookstore Logo */}
                <div className="text-xl font-bold">
                    <Link to="/" className="hover:text-gray-200">
                        Bookstore
                    </Link>
                </div>

                {/* Quick Links */}
                <nav className="space-x-6">
                    <Link to="/about" className="hover:text-gray-200">
                        About Us
                    </Link>
                    <Link to="/contact" className="hover:text-gray-200">
                        Contact
                    </Link>
                    <Link to="/privacy" className="hover:text-gray-200">
                        Privacy Policy
                    </Link>
                </nav>
            </div>

             {/* Copyright text */}
            <div className="container mx-auto px-6 mt-4 text-center text-gray-500">
                © {new Date().getFullYear()} Bookstore. All rights reserved.
             </div>
        </footer>
    );
};

export default Footer;