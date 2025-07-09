
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import Swal from 'sweetalert2';

const useAuth = () => ( {
    createUser: ( email, password ) => {
        console.log( 'Creating user:', email, password );
        
        return Promise.resolve( { user: { email } } );
    },
    updateUserProfile: ( name, photoURL ) => {
        console.log( 'Updating profile:', name, photoURL );
        
        return Promise.resolve();
    },
    googleSignIn: () => {
        console.log( 'Signing in with Google' );
        
        return Promise.resolve();
    },
} );

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const navigate = useNavigate();
    const { createUser, updateUserProfile, googleSignIn } = useAuth();
    const [ showPassword, setShowPassword ] = useState( false );
    const [ firebaseError, setFirebaseError ] = useState( '' );

    const onSubmit = async ( data ) => {
        setFirebaseError( '' );
        try {
            // 1. Create user in Firebase
            await createUser( data.email, data.password );

            // 2. Update user's profile with name and photo
            await updateUserProfile( data.name, data.photoURL );

            // 3. Optionally show a success message and redirect using sweetalert2
            Swal.fire("Success!", "Your account has been created.", "success");

            reset();
            navigate( '/' );
        } catch ( error ) {
            // Handle Firebase errors (e.g., email-already-in-use)
            setFirebaseError( error.message );
            console.error( error );
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            navigate( '/' );
        } catch ( error ) {
            setFirebaseError( error.message );
            console.error( error );
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <form onSubmit={ handleSubmit( onSubmit ) } className="card-body">
                    <h1 className="text-3xl font-bold text-center">Create an Account</h1>

                    {/* Name Field */ }
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text mr-2">Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Your name"
                            { ...register( 'name', { required: 'Name is required' } ) }
                            className="input input-bordered"
                        />
                        { errors.name && <p className="text-red-600 mt-1">{ errors.name.message }</p> }
                    </div>

                    {/* Photo URL Field */ }
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text mr-2">Photo URL</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/photo.jpg"
                            { ...register( 'photoURL', { required: 'Photo URL is required' } ) }
                            className="input input-bordered"
                        />
                        { errors.photoURL && <p className="text-red-600 mt-1">{ errors.photoURL.message }</p> }
                    </div>

                    {/* Email Field */ }
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text mr-2">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            { ...register( 'email', { required: 'Email is required' } ) }
                            className="input input-bordered"
                        />
                        { errors.email && <p className="text-red-600 mt-1">{ errors.email.message }</p> }
                    </div>

                    {/* Password Field */ }
                    <div className="form-control relative">
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
                            className="input input-bordered"
                        />
                        <span className="absolute top-4 right-7 cursor-pointer" onClick={ () => setShowPassword( !showPassword ) }>
                            { showPassword ? <FaRegEye /> : <FaRegEyeSlash /> }
                        </span>
                        { errors.password && <p className="text-red-600 mt-1">{ errors.password.message }</p> }
                    </div>

                    { firebaseError && <p className="text-red-600 mt-2 text-center">{ firebaseError }</p> }

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>

                    <div className="divider">OR</div>

                    <div className="form-control">
                        <button type="button" onClick={ handleGoogleSignIn } className="btn btn-outline">
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
    );
};

export default Register;