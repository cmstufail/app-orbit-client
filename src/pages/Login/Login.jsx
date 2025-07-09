
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { useState } from 'react';
import Swal from 'sweetalert2';

const useAuth = () => ( {
    signIn: ( email, password ) => {
        console.log( 'Signing in user:', email, password );
        
        return Promise.resolve( { user: { email } } );
    },
    googleSignIn: () => {
        console.log( 'Signing in with Google' );
    
        return Promise.resolve();
    },
} );

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, googleSignIn } = useAuth();
    const [ firebaseError, setFirebaseError ] = useState( '' );

    // Redirect user to the page they were on before, or to the homepage
    const from = location.state?.from?.pathname || '/';

    const onSubmit = async ( data ) => {
        setFirebaseError( '' );
        try {
            // Sign in user with Firebase
            await signIn( data.email, data.password );

            // Optionally show a success message
            Swal.fire("Success!", "You've logged in successfully.", "success");

            navigate( from, { replace: true } );
        } catch ( error ) {
            // Handle Firebase errors (e.g., wrong-password, user-not-found)
            setFirebaseError( 'Invalid email or password. Please try again.' );
            console.error( error );
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            navigate( from, { replace: true } );
        } catch ( error ) {
            setFirebaseError( error.message );
            console.error( error );
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="card w-full max-w-sm shadow-2xl bg-base-100">
                <form onSubmit={ handleSubmit( onSubmit ) } className="card-body">
                    <h1 className="text-3xl font-bold text-center">Login Now</h1>

                    {/* Email Field */ }
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
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
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            { ...register( 'password', { required: 'Password is required' } ) }
                            className="input input-bordered"
                        />
                        { errors.password && <p className="text-red-600 mt-1">{ errors.password.message }</p> }
                    </div>

                    { firebaseError && <p className="text-red-600 mt-2 text-center">{ firebaseError }</p> }

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>

                    <div className="divider">OR</div>

                    <div className="form-control">
                        <button type="button" onClick={ handleGoogleSignIn } className="btn btn-outline">
                            <FaGoogle /> Continue with Google
                        </button>
                    </div>

                    <p className="text-center mt-4">
                        New to AppOrbit?{ ' ' }
                        <Link to="/register" className="link link-primary">
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;