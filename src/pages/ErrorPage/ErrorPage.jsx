import { Link, useNavigate } from 'react-router-dom';
import { VscArrowLeft, VscHome } from "react-icons/vsc";

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
            <div className="w-full max-w-md mx-auto text-center">
                {/* Illustration */ }
                <div className="flex justify-center mb-8">
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="#f43f5e" />
                        <path d="M13 15h-2v-6h2v6zm0 4h-2v-2h2v2z" fill="#ffffff" />
                        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="rgba(244, 63, 94, 0.3)" />
                    </svg>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    Page Not Found
                </h1>
                <p className="mt-4 text-base text-gray-500">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                {/* Action Buttons */ }
                <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
                    <button
                        onClick={ () => navigate( -1 ) }
                        className="inline-flex items-center justify-center w-full px-6 py-3 font-medium text-white transition-colors duration-200 bg-gray-800 border border-transparent rounded-md shadow-sm sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <VscArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center w-full px-6 py-3 font-medium text-gray-800 transition-colors duration-200 bg-gray-200 border border-transparent rounded-md sm:w-auto hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <VscHome className="w-5 h-5 mr-2" />
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;