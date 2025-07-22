import { useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';

import axios from 'axios';
import { auth } from './../utilities/firebase.init';
import { AuthContext } from './AuthContext'; 
import { toast } from 'react-hot-toast';


const axiosPublic = axios.create( {
    baseURL: `${ import.meta.env.VITE_API_BASE_URL }/api`,
    withCredentials: false,
} );

const AuthProvider = ( { children } ) => {
    const [ user, setUser ] = useState( null );
    const [ loading, setLoading ] = useState( true );

    const googleProvider = new GoogleAuthProvider();

    const createUser = ( email, password ) => {
        setLoading( true );
        return createUserWithEmailAndPassword( auth, email, password );
    };

    const signIn = ( email, password ) => {
        setLoading( true );
        return signInWithEmailAndPassword( auth, email, password );
    };

    const googleSignIn = () => {
        setLoading( true );
        return signInWithPopup( auth, googleProvider );
    };

    const updateUserProfile = ( name, photo ) => {
        return updateProfile( auth.currentUser, {
            displayName: name,
            photoURL: photo,
        } );
    };

    const logout = async () => {
        setLoading( true );
        let loadingToastId;
        try {
            loadingToastId = toast.loading( 'Logging out...' );
            localStorage.removeItem( 'access-token' );
            await signOut( auth );
            toast.dismiss( loadingToastId );
            toast.success( 'Logged out successfully!' );
            console.log( "AuthProvider: Firebase signOut successful. User state cleared." );
        } catch ( error ) {
            toast.dismiss( loadingToastId );
            console.error( "Logout error:", error );
            toast.error( 'Logout failed. Please try again.' );
        } finally {
            setUser( null );
            setLoading( false );
        }
    };

    useEffect( () => {
        const unsubscribe = onAuthStateChanged( auth, async ( currentUser ) => {
            console.log( 'AuthProvider: onAuthStateChanged Fired. Current User (Raw from Firebase):', currentUser );

            if ( currentUser ) {
                try {
                    const storedCustomToken = localStorage.getItem( 'access-token' );

                    if ( !storedCustomToken ) {
                        console.log( 'AuthProvider: Custom JWT missing. Fetching new one from backend.' );
                        const idToken = await currentUser.getIdToken();
                        const res = await axiosPublic.post( '/auth/jwt', {
                            token: idToken,
                            email: currentUser.email,
                            name: currentUser.displayName,
                            photo: currentUser.photoURL,
                            uid: currentUser.uid
                        } );
                        localStorage.setItem( 'access-token', res.data.token );
                        console.log( 'AuthProvider: New Custom JWT stored in localStorage.' );
                    } else {
                        console.log( 'AuthProvider: Custom JWT already found in localStorage. Reusing.' );
                    }

                    setUser( currentUser );

                } catch ( err ) {
                    console.error( "AuthProvider: Error during token process (Firebase or Backend):", err );
                    localStorage.removeItem( 'access-token' );
                    setUser( null );
                } finally {
                    setLoading( false );
                    console.log( 'AuthProvider: Loading set to false after definitive state check.' );
                }
            } else {
                localStorage.removeItem( 'access-token' );
                console.log( 'AuthProvider: No current user. Token removed from localStorage.' );
                setUser( null );
                setLoading( false );
            }
        } );

        return () => {
            unsubscribe();
        };
    }, [ auth ] );

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logout,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={ authInfo }>
            { children }
        </AuthContext.Provider>
    );
};

export default AuthProvider;