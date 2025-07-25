import { FaUserPlus, FaThumbsUp, FaShareAlt, FaCogs } from 'react-icons/fa';

const HowItWorks = () => {
    return (
        <div className="py-12 my-18 bg-gradient-to-br from-[var(--how-it-works-gradient-start)] to-[var(--how-it-works-gradient-end)]">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-base-content mb-12">How AppOrbit Works</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Join Community */ }
                    <div className="card bg-base-200 shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                        <div className="text-primary text-5xl mb-4 mx-auto w-fit p-3 bg-blue-100 rounded-full">
                            <FaUserPlus />
                        </div>
                        <h3 className="text-xl font-semibold text-base-content pb-2">1. Join Our Community</h3>
                        <p className="text-base-content text-opacity-70 text-sm">
                            Sign up quickly with your email or Google account to become a part of the AppOrbit family. It's free and easy!
                        </p>
                    </div>

                    {/* Discover & Interact */ }
                    <div className="card bg-base-200 shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                        <div className="text-secondary text-5xl mb-4 mx-auto w-fit p-3 bg-pink-100 rounded-full">
                            <FaThumbsUp />
                        </div>
                        <h3 className="text-xl font-semibold text-base-content pb-2">2. Discover & Upvote</h3>
                        <p className="text-base-content text-opacity-70 text-sm">
                            Explore hundreds of new tech products. Upvote your favorites to help them gain visibility and climb the ranks.
                        </p>
                    </div>

                    {/* Share Your Creations */ }
                    <div className="card bg-base-200 shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                        <div className="text-info text-5xl mb-4 mx-auto w-fit p-3 bg-cyan-100 rounded-full">
                            <FaShareAlt />
                        </div>
                        <h3 className="text-xl font-semibold text-base-content pb-2">3. Share Your Products</h3>
                        <p className="text-base-content text-opacity-70 text-sm">
                            Have a cool web app, AI tool, or software? Submit it to AppOrbit and showcase it to a global audience.
                        </p>
                    </div>

                    {/* Unlock Premium Features */ }
                    <div className="card bg-base-200 shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                        <div className="text-warning text-5xl mb-4 mx-auto w-fit p-3 bg-yellow-100 rounded-full">
                            <FaCogs />
                        </div>
                        <h3 className="text-xl font-semibold text-base-content pb-2">4. Unlock Premium</h3>
                        <p className="text-base-content text-opacity-70 text-sm">
                            Upgrade your membership to unlock unlimited product submissions, advanced analytics, and exclusive features.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;