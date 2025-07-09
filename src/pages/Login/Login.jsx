
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';


const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, googleSignIn } = useAuth();
    const [ loginError, setLoginError ] = useState( '' );
    const [ showPassword, setShowPassword ] = useState( false );

    const from = location.state?.from?.pathname || '/';

    const onSubmit = async ( data ) => {
        setLoginError( '' );
        try {
            // Sign in user with Firebase
            await signIn( data.email, data.password );

            // show a success message
            Swal.fire( "Success!", "You've logged in successfully.", "success" );

            navigate( from, { replace: true } );
        } catch ( error ) {
            setLoginError( 'Invalid email or password. Please try again.' );
            console.error( error );
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            navigate( from, { replace: true } );
        } catch ( error ) {
            setLoginError( error.message );
            console.error( "Google Sign-In Error:", error );
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
                            className="input input-bordered focus:outline-none"
                        />
                        { errors.email && <p className="text-red-600 mt-1">{ errors.email.message }</p> }
                    </div>

                    {/* Password Field */ }
                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type={ showPassword ? 'text' : 'password' }
                            placeholder="••••••••"
                            { ...register( 'password', { required: 'Password is required' } ) }
                            className="input input-bordered focus:outline-none pr-10"
                        />
                        {/* Show/Hide Icon */ }
                        <span
                            className="absolute top-9 right-5 z-10 cursor-pointer"
                            onClick={ () => setShowPassword( !showPassword ) }
                        >
                            { showPassword ? <FaRegEye /> : <FaRegEyeSlash /> }
                        </span>
                        { errors.password && <p className="text-red-600 mt-1">{ errors.password.message }</p> }
                    </div>

                    { loginError && <p className="text-red-600 mt-2 text-center">{ loginError }</p> }

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