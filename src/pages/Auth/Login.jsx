import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const Login = () => {
    const { signIn, googleSignIn, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [ loginError, setLoginError ] = useState( '' );
    const [ showPassword, setShowPassword ] = useState( false );
    const [ isSubmitting, setIsSubmitting ] = useState( false );

    const from = location.state?.from?.pathname || '/';

    useEffect( () => {
        if ( !authLoading && user ) {
            navigate( from, { replace: true } );
        }
    }, [ user, authLoading, navigate, from ] );

    const handleEmailPasswordLogin = async ( data ) => {
        setLoginError( '' );
        setIsSubmitting( true );

        let loadingToastId;

        try {
            loadingToastId = toast.loading( 'Logging in...' );
            const result = await signIn( data.email, data.password );
            const loggedUser = result.user;

            const res = await axios.post( `${ import.meta.env.VITE_API_BASE_URL }/api/auth/jwt`, {
                token: await loggedUser.getIdToken(),
                email: loggedUser.email,
                name: loggedUser.displayName,
                photo: loggedUser.photoURL,
                uid: loggedUser.uid
            }, { withCredentials: false } );

            localStorage.setItem( 'access-token', res.data.token );
            console.log( 'LoginPage: Custom JWT stored:', res.data.token.substring( 0, 30 ) + '...' );

            toast.dismiss( loadingToastId );
            toast.success( 'Logged in successfully!' );

        } catch ( error ) {
            toast.dismiss( loadingToastId );
            console.error( 'Login error:', error );

            let errorMessage = 'Login failed. Please try again.';

            if ( error.code ) {
                switch ( error.code ) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        errorMessage = 'Invalid email or password.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many login attempts. Please try again later or reset password.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email format.';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error. Please check your connection.';
                        break;
                    case 'ECONNABORTED':
                        errorMessage = 'Connection timeout. Please try again.';
                        break;
                    case 'ERR_NETWORK':
                        errorMessage = 'Cannot connect to server. Please try again later.';
                        break;
                }
            } else if ( error.response ) {
                errorMessage = error.response.data.error || error.response.data.message || 'Authentication error';
            }

            setLoginError( errorMessage );
            toast.error( errorMessage );
        } finally {
            setIsSubmitting( false );
        }
    };

    const handleGoogleSignIn = async () => {
        setLoginError( '' );
        setIsSubmitting( true );

        let loadingToastId;
        try {
            loadingToastId = toast.loading( 'Logging in with Google...' );
            const result = await googleSignIn();
            const loggedUser = result.user;

            const res = await axios.post( `${ import.meta.env.VITE_API_BASE_URL }/api/auth/jwt`, {
                token: await loggedUser.getIdToken(),
                email: loggedUser.email,
                name: loggedUser.displayName,
                photo: loggedUser.photoURL,
                uid: loggedUser.uid
            }, { withCredentials: false } );

            localStorage.setItem( 'access-token', res.data.token );
            console.log( 'LoginPage: Custom JWT stored after Google login:', res.data.token.substring( 0, 30 ) + '...' );

            toast.dismiss( loadingToastId );
            toast.success( 'Logged in successfully with Google!' );

        } catch ( error ) {
            toast.dismiss( loadingToastId );
            console.error( 'Google login error:', error );
            let errorMessage = 'Google login failed. Please try again.';

            if ( error.code === 'auth/popup-closed-by-user' ) {
                errorMessage = 'Google login popup was closed.';
            } else if ( error.response ) {
                errorMessage = error.response.data.error || error.response.data.message || 'Authentication error';
            }

            setLoginError( errorMessage );
            toast.error( errorMessage );
        } finally {
            setIsSubmitting( false );
        }
    };

    if ( authLoading ) {
        return (
            <div className="text-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Loading authentication state...</p>
            </div>
        );
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Access your dashboard, submit products, and unlock premium features.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={ handleSubmit( handleEmailPasswordLogin ) } className="card-body">
                        <h1 className="text-3xl font-bold text-center">Login Now</h1>

                        {/* Email Field */ }
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                { ...register( 'email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                } ) }
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
                                { ...register( 'password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                } ) }
                                className="input input-bordered focus:outline-none pr-10"
                            />
                            <span
                                className="absolute top-12 right-3 cursor-pointer"
                                onClick={ () => setShowPassword( !showPassword ) }
                            >
                                { showPassword ? <FaRegEye /> : <FaRegEyeSlash /> }
                            </span>
                            { errors.password && <p className="text-red-600 mt-1">{ errors.password.message }</p> }
                        </div>

                        { loginError && (
                            <div className="alert alert-error mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{ loginError }</span>
                            </div>
                        ) }

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={ isSubmitting }
                            >
                                { isSubmitting ? (
                                    <span className="loading loading-spinner"></span>
                                ) : 'Login' }
                            </button>
                        </div>

                        <div className="divider">OR</div>

                        <div className="form-control">
                            <button
                                type="button"
                                onClick={ handleGoogleSignIn }
                                className="btn btn-outline"
                                disabled={ isSubmitting }
                            >
                                <FaGoogle />
                                { isSubmitting ? 'Signing in...' : 'Continue with Google' }
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
        </div>
    );
};

export default Login;
