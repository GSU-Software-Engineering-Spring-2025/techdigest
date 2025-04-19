import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-tech-dark-purple text-white">
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-bold text-2xl mb-4 text-white">
                            TechDigest
                        </h3>
                        <p className="text-gray-200">
                            Your daily source for the latest in technology news
                            and insights.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-white">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-200 hover:text-white hover:underline"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/categories"
                                    className="text-gray-200 hover:text-white hover:underline"
                                >
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className="text-gray-200 hover:text-white hover:underline"
                                >
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-white">Contact</h4>
                        <p className="text-gray-200">contact@techdigest.com</p>
                        <p className="text-gray-200 mt-4">
                            © {new Date().getFullYear()} TechDigest. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
