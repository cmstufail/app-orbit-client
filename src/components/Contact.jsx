import { useEffect, useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { toast } from 'react-hot-toast';
import Container from './Container';


const Contact = () => {

    const contactItems = [
        {
            icon: <FaMapMarkerAlt className="text-primary text-2xl" />,
            text: "3171, Azir Market, Beanibazar, Sylhet, Bangladesh",
            action: () => {
                window.open(
                    "https://www.google.com/maps/place/Azir+Market,+Beanibazar/@24.904583,92.156583,15z/data=!4m6!3m5!1s0x3751f3c7f80a0001:0x9a4a4b1e3e1e3e1e!8m2!3d24.904583!4d92.156583!16s%2Fg%2F11b8z8z8z8",
                    "_blank"
                );
            }
        },
        {
            icon: <FaWhatsapp className="text-primary text-2xl" />,
            text: "+880 1710 649 191",
            action: () => {
                window.open(
                    "https://wa.me/8801710649191",
                    "_blank"
                );
            }
        },
        {
            icon: <FaPhone className="text-primary text-2xl" />,
            text: "+880 1710 649 191",
            action: () => {
                window.location.href = "tel:+8801710649191";
            }
        },
        {
            icon: <SiGmail className="text-primary text-2xl" />,
            text: "support@apporbit.com",
            action: () => {
                window.location.href = "mailto:support@apporbit.com";
            }
        },
        {
            icon: <FaEnvelope className="text-primary text-2xl" />,
            text: "info@apporbit.com",
            action: () => {
                window.location.href = "mailto:info@apporbit.com";
            }
        }
    ];

    const [ formData, setFormData ] = useState( {
        name: '',
        email: '',
        subject: '',
        message: ''
    } );

    const [ isSubmitting, setIsSubmitting ] = useState( false );
    // Set the page title when the component mounts
    useEffect( () => {
        document.title = 'Contact || AppOrbit';
    }, [] );

    const handleChange = ( e ) => {
        const { name, value } = e.target;
        setFormData( prev => ( { ...prev, [ name ]: value } ) );
    };

    const handleSubmit = async ( e ) => {
        e.preventDefault();
        setIsSubmitting( true );
        const loadingToastId = toast.loading( 'Sending the message...' );

        if ( !formData.name || !formData.email || !formData.subject || !formData.message ) {
            toast.dismiss( loadingToastId );
            toast.error( 'Fill in all fields!' );
            setIsSubmitting( false );
            return;
        }

        if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( formData.email ) ) {
            toast.dismiss( loadingToastId );
            toast.error( 'এPlease provide a valid email address!' );
            setIsSubmitting( false );
            return;
        }

        try {
            await new Promise( resolve => setTimeout( resolve, 2000 ) );

            toast.dismiss( loadingToastId );
            toast.success( 'Your message has been sent successfully! We will contact you soon.' );
            setFormData( { name: '', email: '', subject: '', message: '' } );
        } catch ( error ) {
            toast.dismiss( loadingToastId );
            console.error( 'Error sending contact message.:', error );
            toast.error( 'Failed to send message. Please try again.' );
        } finally {
            setIsSubmitting( false );
        }
    };

    return (
        <Container>
            <div className="py-12 bg-base-100 min-h-screen">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-primary">
                    Contact Us
                </h1>

                <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Information */ }
                    <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-6 text-base-content">
                            Contact information
                        </h2>
                        <div className="space-y-4 text-lg">
                            { contactItems.map( ( item, index ) => (
                                <div
                                    key={ index }
                                    className="flex items-center gap-3 hover:bg-base-300 p-2 rounded-lg transition-colors cursor-pointer"
                                    onClick={ item.action }
                                >
                                    { item.icon }
                                    <span className="text-base-content hover:text-primary">
                                        { item.text }
                                    </span>
                                </div>
                            ) ) }
                        </div>
                    </div>

                    {/* Contact Form */ }
                    <div className="bg-base-200 p-8 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-6">Send us a message</h2>
                        <form onSubmit={ handleSubmit } className="space-y-4">
                            {/* Name Field */ }
                            <div className="form-control">
                                <label className="label"><span className="label-text">Your name</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    className="input input-bordered w-full focus:outline-none"
                                    value={ formData.name }
                                    onChange={ handleChange }
                                    required
                                />
                            </div>
                            {/* Email Field */ }
                            <div className="form-control">
                                <label className="label"><span className="label-text">Your email</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address."
                                    className="input input-bordered w-full focus:outline-none"
                                    value={ formData.email }
                                    onChange={ handleChange }
                                    required
                                />
                            </div>
                            {/* Subject Field */ }
                            <div className="form-control">
                                <label className="label"><span className="label-text">Subject</span></label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Enter subject"
                                    className="input input-bordered w-full focus:outline-none"
                                    value={ formData.subject }
                                    onChange={ handleChange }
                                    required
                                />
                            </div>
                            {/* Message Field */ }
                            <div className="form-control">
                                <label className="label"><span className="label-text"> Message</span></label>
                                <textarea
                                    name="message"
                                    placeholder="Enter Message"
                                    className="textarea textarea-bordered h-24 w-full focus:outline-none"
                                    value={ formData.message }
                                    onChange={ handleChange }
                                    required
                                ></textarea>
                            </div>
                            {/* Submit Button */ }
                            <div className="form-control mt-6">
                                <button type="submit" className="btn btn-primary" disabled={ isSubmitting }>
                                    <FaPaperPlane className="mr-2" /> { isSubmitting ? 'Sending...' : 'Send message' }
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </Container>
    );
};

export default Contact;