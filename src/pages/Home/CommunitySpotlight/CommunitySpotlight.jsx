import { FaUsers, FaLightbulb, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';


const CommunitySpotlight = () => {
  const { user, loading } = useAuth();

  if ( loading ) {
    return (
      <div className="py-16 bg-base-100 text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p>Loading user status...</p>
      </div>
    );
  }

  const targetPath = user ? "/dashboard" : "/register";
  const buttonText = user ? "Go to My Dashboard" : "Join AppOrbit Today!";

  return (
    <div className="bg-base-200 rounded-lg py-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-base-content mb-5">Join Our Thriving Community</h2>

        <p className="text-lg text-base-content text-opacity-70 max-w-3xl mx-auto mb-10">
          AppOrbit isn't just about products; it's about people! Connect with innovators, get feedback on your creations, and discover the next big thing together.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Community Aspect 1: Connect */ }
          <div className="flex flex-col items-center p-6 bg-base-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <FaUsers className="text-primary text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">Connect & Collaborate</h3>
            <p className="text-base-content text-opacity-70 text-sm">
              Engage with developers, designers, and tech enthusiasts. Share ideas, collaborate on projects, and grow your network.
            </p>
          </div>

          {/* Community Aspect 2: Innovate */ }
          <div className="flex flex-col items-center p-6 bg-base-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <FaLightbulb className="text-secondary text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">Inspire & Be Inspired</h3>
            <p className="text-base-content text-opacity-70 text-sm">
              See what others are building and get inspired. Give and receive constructive feedback to refine your own products.
            </p>
          </div>

          {/* Community Aspect 3: Grow */ }
          <div className="flex flex-col items-center p-6 bg-base-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <FaRocket className="text-info text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">Launch & Grow</h3>
            <p className="text-base-content text-opacity-70 text-sm">
              Launch your product to an engaged audience and leverage community support to gain early traction and user insights.
            </p>
          </div>
        </div>

        {/* Call to Action - Button will now be conditional */ }
        <p className="text-xl mb-6">Ready to make your mark?</p>
        <Link to={ targetPath } className="btn btn-lg btn-primary normal-case hover:bg-white hover:text-black">
          { buttonText }
        </Link>
      </div>
    </div>
  );
};

export default CommunitySpotlight;