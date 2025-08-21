import { useEffect } from 'react';
import Container from './Container';

// components


const PrivacyPolicy = () => {


    // Set the page title when the component mounts
    useEffect( () => {
        document.title = 'Privacy Policy || AppOrbit';
    }, [] );

    return (
        <Container>
            <div className="py-12 bg-base-100 min-h-screen">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-primary">
                    Privacy Policy
                </h1>

                <section className="mb-8 bg-base-200 p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4">1. What information do we collect?</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        <span className='font-bold'>AppOrbit</span> ("we", "us", "our") takes the privacy of users seriously. When you use our website or mobile application (collectively, the "Services"), we may collect various types of information.
                    </p>
                    <h3 className="text-xl font-semibold mb-2">Personally identifiable information (PII):</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>**Username:** The name used for your account.</li>
                        <li>**Email Address:** For your communication and account authentication.</li>
                        <li>**Profile picture:** If you upload a profile picture.</li>
                        <li>**Payment Information:** When you make a subscription or other purchase, payment processors such as Stripe collect your payment details. We do not store credit card information directly.</li>
                        <li>**Contact information:** When you contact us (such as submitting a form), the name, email, and message you provide.</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-2 mt-4">Non-personally identifiable information:</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>**Usage Data:** How you use our services, such as browser type, device information, access time, pages visited.</li>
                        <li>**Cookies and Tracking Technologies:** We use cookies and similar tracking technologies to track your preferences, improve the service, and personalize your experience.</li>
                    </ul>
                </section>

                <section className="mb-8 bg-base-200 p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4">2. How do we use your information?</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        We use the information we collect from you for the following purposes:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>For service provision, operation and maintenance.</li>
                        <li>To personalize your experience and show you relevant content.</li>
                        <li>To respond to your questions or requests.</li>
                        <li>To manage user interactions like reviews, product submissions, and upvoting.</li>
                        <li>To complete the payment process and keep records of transactions.</li>
                        <li>To improve our service and develop new features.</li>
                        <li>To detect and prevent security and fraud.</li>
                        <li>For market research and analysis.</li>
                    </ul>
                </section>

                <section className="mb-8 bg-base-200 p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4">3. Disclosure of your information</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        We may share your personal information with third parties in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>**Service Providers:** Third-party vendors and service providers who work on our behalf (e.g. payment processors, hosting providers, data analytics).</li>
                        <li>**Legal Obligation:** To comply with a legal obligation, respond to government requests, or protect our rights.</li>
                        <li>**Business Transfer:** In the case of an acquisition, merger, or asset sale.</li>
                        <li>**With your consent:** For any other purpose with your express consent.</li>
                    </ul>
                </section>

                <section className="mb-8 bg-base-200 p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4">4. Cookies and tracking technology</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        We use cookies and other tracking technologies to improve your browsing experience and analyze the use of our services. You can control cookies through your browser settings, but disabling cookies may affect some of the functionality of the Service.
                    </p>
                </section>

                <section className="mb-8 bg-base-200 p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4">5. your right</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        You may have certain rights regarding your personal information, including accessing your information, Right to rectification or erasure. To exercise these rights, please contact us at the contact information below.
                    </p>
                </section>

                <section className="mb-8 bg-base-200 p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4">6. Children's privacy</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from children under the age of 13.
                    </p>
                </section>

                <section className="bg-base-200 p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4">7. Contact us</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        If you have any questions or concerns about this Privacy Policy, please contact us at the following email address:
                    </p>
                    <p className="text-lg text-primary font-semibold">
                        support@apporbit.com
                    </p>
                    <p className="text-sm mt-4">
                        Last updated: July 23, 2025
                    </p>
                </section>
            </div>
        </Container>
    );
};

export default PrivacyPolicy;