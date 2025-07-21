import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if ( !API_BASE_URL ) {
    console.error( "VITE_API_BASE_URL is not defined in your .env.local file! Please set it to http://localhost:5000." );
}

export const axiosSecure = axios.create( {
    baseURL: `${ API_BASE_URL }/api`,
    withCredentials: true,
} );


const useAxiosSecure = () => {
    const navigate = useNavigate();

    useEffect( () => {
        const requestInterceptorId = axiosSecure.interceptors.request.use(
            ( config ) => {
                const token = localStorage.getItem( 'access-token' );
                if ( token ) {
                    config.headers.Authorization = `Bearer ${ token }`;
                }
                return config;
            }, ( error ) => { return Promise.reject( error ); }
        );

        const responseInterceptorId = axiosSecure.interceptors.response.use(
            ( res ) => res,
            async ( error ) => {
                const status = error.response?.status;
                if ( status === 401 || status === 403 ) {
                    console.error( "useAxiosSecure: Caught 401/403 error. Redirecting to login." );
                    localStorage.removeItem( 'access-token' );
                    navigate( '/login', { replace: true } );
                }
                return Promise.reject( error );
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject( requestInterceptorId );
            axiosSecure.interceptors.response.eject( responseInterceptorId );
        };
    }, [ navigate, axiosSecure ] );

    return axiosSecure;
};

export default useAxiosSecure;