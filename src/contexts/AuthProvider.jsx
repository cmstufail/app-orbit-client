import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContex'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
import { auth } from '../firebase/firebase.init'

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ( { children } ) => {

    const [ user, setUser ] = useState( null );
    const [ loading, setLoading ] = useState( true );

    const createUser = ( email, password ) => {
        setLoading( true );
        return createUserWithEmailAndPassword( auth, email, password )
    }

    const signIn = ( email, password ) => {
        setLoading( true );
        return signInWithEmailAndPassword( auth, email, password )
    }

    const logOut = () => {
        setLoading( true );
        return signOut( auth );
    }

    const googleSignIn = () => {
        setLoading( true );
        return signInWithPopup( auth, googleProvider );
    };

    const updateUserProfile = ( name, photoURL ) => {
        return updateProfile( auth.currentUser, {
            displayName: name,
            photoURL: photoURL
        } );
    };

    useEffect( () => {
        const unsubscribe = onAuthStateChanged( auth, currentUser => {
            setUser( currentUser );
            console.log( 'Current User:', currentUser );
            setLoading( false );
        } );

        return () => {
            unsubscribe();
        }
    }, [] )

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
        updateUserProfile

    }

    return (
        <AuthContext.Provider value={ authInfo }>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider
