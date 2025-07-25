import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa';


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

        if ( document.documentElement ) {
            if ( theme === 'dark' ) {
                // --- couponSlider ---
                document.documentElement.style.setProperty( '--coupon-gradient-start', '#1a202c' );
                document.documentElement.style.setProperty( '--coupon-gradient-end', '#2d3748' );

                // --- HowItWorks ---
                document.documentElement.style.setProperty( '--how-it-works-gradient-start', '#2d3748' );
                document.documentElement.style.setProperty( '--how-it-works-gradient-end', '#4a5568' );

                // --- BannerSlideContent ---
                document.documentElement.style.setProperty( '--banner-main-text-color', '#E0F2FE' );
                document.documentElement.style.setProperty( '--banner-sub-text-color', '#BFDBFE' );
                document.documentElement.style.setProperty( '--banner-button-bg-color', '#60A5FA' );
                document.documentElement.style.setProperty( '--banner-button-shadow', '0px 0px 15px rgba(96, 165, 250, 0.4)' );

            } else {
                // --- couponSlider ---
                document.documentElement.style.setProperty( '--coupon-gradient-start', '#9D00FF' );
                document.documentElement.style.setProperty( '--coupon-gradient-end', '#FF8DA1' );

                // ---  HowItWorks  ---
                document.documentElement.style.setProperty( '--how-it-works-gradient-start', '#e0f2fe' );
                document.documentElement.style.setProperty( '--how-it-works-gradient-end', '#e0f7fa' );

                // ---  BannerSlideContent ---
                document.documentElement.style.setProperty( '--banner-main-text-color', '#1a202c' );
                document.documentElement.style.setProperty( '--banner-sub-text-color', '#4a5568' );
                document.documentElement.style.setProperty( '--banner-button-bg-color', '#007BFF' );
                document.documentElement.style.setProperty( '--banner-button-shadow', '0px 8px 15px rgba(0, 0, 0, 0.2)' );
            }
        }

    }, [ theme ] );

    const toggleTheme = () => {
        setTheme( prevTheme => ( prevTheme === 'light' ? 'dark' : 'light' ) );
    };

    return (
        <div className="fixed top-12 md:top-16 right-2 z-50">
            <button onClick={ toggleTheme } className="btn btn-circle btn-primary shadow-lg">
                { theme === 'light' ? (
                    <FaMoon />
                ) : (
                    <FaSun />
                ) }
            </button>
        </div>
    );
}

export default ThemeToggler
