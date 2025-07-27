import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

import useAuth from '../../hooks/useAuth';
import Lottie from 'lottie-react';
import registerLottie from '../../../src/assets/lotties/register.json'


const image_hosting_key = import.meta.env.VITE_IMGBB_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${ image_hosting_key }`;

const Register = () => {

    useEffect( () => {
        // Set the page title when the component mounts
        document.title = 'Register || AppOrbit';
    }, [] );

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const navigate = useNavigate();

    const { createUser, updateUserProfile, googleSignIn } = useAuth();

    const [ showPassword, setShowPassword ] = useState( false );

    const [ registerError, setRegisterError ] = useState( '' );

    const onSubmit = async ( data ) => {
        setRegisterError( '' );
        try {
            const imageFile = { image: data.photo[ 0 ] };
            const res = await axios.post( image_hosting_api, imageFile, {
                headers: { 'Content-Type': 'multipart/form-data' },
            } );

            if ( res.data.success ) {
                const photoURL = res.data.data.display_url;

                const result = await createUser( data.email, data.password );

                await updateUserProfile( data.name, photoURL );

                console.log( 'User created and profile updated:', result.user );

                Swal.fire( {
                    title: "Success!",
                    text: "Your account has been created successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                } );
                reset();
                navigate( '/' );
            } else {
                throw new Error( 'Image upload failed. Please try again.' );
            }
        } catch ( error ) {
            console.error( "Registration Error:", error.message );
            setRegisterError( error.message || 'An unexpected error occurred.' );
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            navigate( '/' );
        } catch ( error ) {
            setRegisterError( error.message );
            console.error( "Google Sign-In Error:", error.message );
        }
    };


    return (
        <div className="hero bg-base-200 min-h-screen pt-0">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <Lottie style={ { width: "300px" } } animationData={ registerLottie } loop={ true }></Lottie>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <h1 className="text-3xl font-bold pb-4 text-center">Register now!</h1>
                        <form onSubmit={ handleSubmit( onSubmit ) } className="">
                            {/* Name Field */ }
                            <fieldset className="fieldset">
                                <label className="label">
                                    <span className="label-text mr-2">Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    { ...register( 'name', { required: 'Name is required' } ) }
                                    className="input input-bordered focus:outline-none"
                                />
                                { errors.name && <p className="text-red-600 mt-1">{ errors.name.message }</p> }
                                <label className="label">
                                    <span className="label-text mr-2">Profile Picture</span>
                                </label>
                                <input
                                    type="file"
                                    placeholder="Profile picture"
                                    { ...register( 'photo', { required: 'Profile picture is required' } ) }
                                    className="file-input file-input-bordered"
                                />
                                { errors.photo && <p className="text-red-600 mt-1">{ errors.photo.message }</p> }

                                <label className="label">
                                    <span className="label-text mr-2">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    { ...register( 'email', { required: 'Email is required' } ) }
                                    className="input input-bordered focus:outline-none"
                                />
                                { errors.email && <p className="text-red-600 mt-1">{ errors.email.message }</p> }

                                <label className="label">
                                    <span className="label-text mr-2">Password</span>
                                </label>
                                <input
                                    type={ showPassword ? 'text' : 'password' }
                                    placeholder="••••••••"
                                    { ...register( 'password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                        pattern: {
                                            value: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
                                            message: 'Password must include uppercase, lowercase, and a number',
                                        },
                                    } ) }
                                    className="input input-bordered focus:outline-none"
                                />
                                {/* Show/Hide Icon */ }
                                <span className="absolute bottom-58 right-12 z-10 cursor-pointer" onClick={ () => setShowPassword( !showPassword ) }>
                                    { showPassword ? <FaRegEye /> : <FaRegEyeSlash /> }
                                </span>
                                { errors.password && <p className="text-red-600 mt-1">{ errors.password.message }</p> }
                            </fieldset>

                            { registerError && <p className="text-red-600 mt-2 text-center text-sm">{ registerError }</p> }

                            <div className="form-control mt-6">
                                <button type="submit" className="btn btn-primary">Register</button>
                            </div>

                            <div className="divider">OR</div>

                            <div className="form-control">
                                <button type="button" onClick={ handleGoogleSignIn } className="btn btn-outline btn-primary">
                                    <FaGoogle /> Continue with Google
                                </button>
                            </div>

                            <p className="text-center mt-4">
                                Already have an account?{ ' ' }
                                <Link to="/login" className="link link-primary">
                                    Login here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;