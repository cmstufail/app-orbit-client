import { useEffect } from 'react';

const TermsOfService = () => {
    // Set the page title when the component mounts
    useEffect( () => {
        document.title = 'Terms of Service || AppOrbit';
    }, [] );

    return (
        <div className="container mx-auto px-4 py-12 bg-base-100 min-h-screen">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-primary">
                Terms of Use
            </h1>

            <section className="mb-8 bg-base-200 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">1. Role and acceptance</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    AppOrbit Please read these Terms of Use ("Terms") before using the Services of ("we", "us", "our") Please read carefully. Our website, application or other services (collectively, the "Services") By accessing or using the Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Services.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    These Terms constitute a legal agreement between you and AppOrbit. We may change or update these Terms from time to time. You will be notified as soon as any changes become effective and your continued use of the Services indicates your acceptance of the changed terms.
                </p>
            </section>

            <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">2. User account</h2>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>You may be required to create an account to use certain features of the Services.</li>
                    <li>You are responsible for maintaining the confidentiality of your account information.</li>
                    <li>You are solely responsible for all activity that occurs under your account.</li>
                    <li>You agree to immediately notify us of any unauthorized use of your account or any breach of security.</li>
                </ul>
            </section>

            <section className="mb-8 bg-base-200 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">3. Use of the Service</h2>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>You agree to use the Services only for lawful purposes and in accordance with these Terms.</li>
                    <li>You will not use the Services to harass, abuse or harm other users.</li>
                    <li>You will not upload any viruses or other malicious code or disrupt the functionality of the Services.</li>
                    <li>You will not collect or store any other user's personal information.</li>
                </ul>
            </section>

            <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">4. Intellectual Property</h2>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>The Service and its original content, features and functionality are the sole property of AppOrbit and its licensors.</li>
                    <li>You will not copy, modify, distribute, sell, or lease any part of the Service without our written permission.</li>
                </ul>
            </section>

            <section className="mb-8 bg-base-200 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">5. Third-party links</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Our Services may contain links to third-party websites or services that are not owned or controlled by <span className='font-bold'>AppOrbit</span>. <span className='font-bold'> AppOrbit </span>assumes no responsibility for the content, privacy policies, or practices of any third-party websites or services.
                </p>
            </section>

            <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">6. Termination of service</h2>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>We may terminate or suspend your access to the Service immediately, without prior notice or liability, if you violate these Terms.</li>
                    <li>Upon termination, your right to use the Service will immediately cease.</li>
                </ul>
            </section>

            <section className="mb-8 bg-base-200 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">7. Disclaimer</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    The Services are provided on an “as is” and “as available” basis. <span className='font-bold'>AppOrbit</span> makes no warranties of any kind, express or implied, including, without limitation, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>
            </section>

            <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">8. Limitation of Liability</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    In no event shall AppOrbit, its directors, employees, partners, agents, suppliers or affiliates, will not be liable to you or any third party for any indirect, incidental, special, consequential or exemplary damages, including without limitation for lost profits, data, use, goodwill, or other intangible damages, arising out of your access to or use of the Services.
                </p>
            </section>

            <section className="bg-base-200 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">9. Contact us</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    If you have any questions about these terms, please contact us at the following email address:
                </p>
                <p className="text-lg text-primary font-semibold">
                    support@apporbit.com
                </p>
                <p className="text-sm text-gray-600 mt-4">
                    Last updated: July 23, 2025
                </p>
            </section>
        </div>
    );
};

export default TermsOfService;