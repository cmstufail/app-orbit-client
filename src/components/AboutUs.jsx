import { useEffect } from 'react';
import { FaUsers, FaLightbulb, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import Container from './Container';


const AboutUs = () => {
    
    // Set the page title when the component mounts
    useEffect( () => {
        document.title = 'About Us || AppOrbit';
    }, [] );

    const { user } = useAuth();
    const redirectTo = user ? '/dashboard' : '/register';
    const buttonText = user ? 'Go to Dashboard' : 'Get Started';

    return (
        <Container>
            <div className="py-12 bg-base-100 min-h-screen">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-primary">
                Our Story
            </h1>

            <section className="mb-12">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-base-200 p-8 rounded-lg shadow-l">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Our Team Working"
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                        />
                    </div>
                    <div className="md:w-1/2 text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-4 text-base-content">About Us</h2>
                        <p className="text-lg text-base-content leading-relaxed">
                            <span className='font-bold'>AppOrbit</span> started with a simple dream: to make the process of discovering and sharing technology products easier and more interactive. Our goal is to make it easy for users to find innovative products and share their opinions. We believe that every great product has a story behind it and that every user's opinion is valuable.
                        </p>
                        <p className="text-lg text-base-content text-opacity-70 leading-relaxed mt-4">
                            Our platform helps users learn about new products, upvote, leave reviews, and help developers showcase their innovations to a global audience. We are building a vibrant community where technology enthusiasts can come together.
                        </p>
                    </div>
                </div>
            </section>

            <section className="my-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-base-200 text-base-content p-8 rounded-lg shadow-lg flex flex-col items-center">
                        <FaRocket className="text-5xl text-primary mb-4" />
                        <h3 className="text-2xl text-base-content font-bold mb-3">Our Goal</h3>
                        <p className="text-base-content text-opacity-70">
                            Inventing and delivering innovative technology products to everyone, and creating a strong platform for users where they can freely express their opinions.
                        </p>
                    </div>
                    <div className="bg-base-200 p-8 rounded-lg shadow-lg flex flex-col items-center">
                        <FaLightbulb className="text-5xl text-accent mb-4" />
                        <h3 className="text-2xl font-bold mb-3 text-base-content">Our View</h3>
                        <p className="text-base-content text-opacity-70">
                            Creating a global community where tech enthusiasts can learn about the latest innovations, discuss, and inspire each other.
                        </p>
                    </div>
                    <div className="bg-base-200 p-8 rounded-lg shadow-lg flex flex-col items-center">
                        <FaUsers className="text-5xl text-info mb-4" />
                        <h3 className="text-2xl font-bold mb-3 text-base-content">Our Team</h3>
                        <p className="text-base-content text-opacity-70">
                            We are a team of dedicated technology enthusiasts, committed to making App Orbit the best platform.
                        </p>
                    </div>
                </div>
            </section>

            <section className="text-center pt-8">
                <h2 className="text-3xl font-bold mb-6 text-base-content">Join us!</h2>
                <p className="text-lg text-base-content text-opacity-70 mb-8">
                    <span className='font-bold'>AppOrbit</span>-Be a part of it and explore the future of technology.
                </p>
                <Link to={ redirectTo } className="btn btn-primary btn-lg">
                    { buttonText }
                </Link>
            </section>
        </div>
        </Container>

    );
};

export default AboutUs;