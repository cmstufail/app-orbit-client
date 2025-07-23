import { useEffect, useState } from 'react'

const ThemeToggler = () => {

    const [ theme, setTheme ] = useState( () => {
        if ( typeof window !== 'undefined' ) {
            const savedTheme = localStorage.getItem( 'theme' );
            return savedTheme || 'light';
        }
        return 'light';
    } );

    useEffect( () => {
        document.documentElement.setAttribute( 'data-theme', theme );
        localStorage.setItem( 'theme', theme );
    }, [ theme ] );

    const toggleTheme = () => {
        setTheme( prevTheme => ( prevTheme === 'light' ? 'dark' : 'light' ) );
    };



    return (
        <div className="fixed top-20 right-4 z-50">
            <button onClick={ toggleTheme } className="btn btn-circle btn-primary shadow-lg">
                { theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M3 12h1m15.364 6.364l-.707-.707M6.343 6.343L5.636 5.636m12.728 0l-.707.707M6.343 17.657l-.707.707M16.95 7.05L16.242 7.758m-8.485 8.485l-.707.707M7.05 16.95l-.707-.707" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                ) }
            </button>
        </div>
    );
}

export default ThemeToggler
