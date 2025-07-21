import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ( { children } ) => {
    const [ user, setUser ] = useState( null );
    const [ loading, setLoading ] = useState( true );

    useEffect( () => {
        const checkAuth = async () => {
            const token = localStorage.getItem( 'token' );

            if ( !token ) {
                setLoading( false );
                return;
            }

            try {
                const decoded = jwtDecode( token );
                const res = await axios.get( '/api/auth/verify', {
                    headers: { Authorization: `Bearer ${ token }` }
                } );

                setUser( {
                    ...decoded,
                    ...res.data.user 
                } );
            } catch ( error ) {
                console.error( 'Auth check failed:', error );
                localStorage.removeItem( 'token' );
                setUser( null );
            } finally {
                setLoading( false );
            }
        };

        checkAuth();
    }, [] );

    const value = {
        user,
        loading,        
    };

    return (
        <AuthContext.Provider value={ value }>
            { children }
        </AuthContext.Provider>
    );
};