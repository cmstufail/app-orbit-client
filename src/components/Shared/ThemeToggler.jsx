// import { useEffect, useState } from 'react';
// import { FaMoon, FaSun } from 'react-icons/fa';

// const ThemeToggler = () => {
//     const [ theme, setTheme ] = useState( 'light' );

//     // Initialize theme from localStorage and apply initial styles
//     useEffect( () => {
//         if ( typeof window !== 'undefined' ) {
//             const savedTheme = localStorage.getItem( 'theme' ) || 'light';
//             setTheme( savedTheme );
//             applyThemeStyles( savedTheme );
//         }
//     }, [] );

//     // Apply theme styles and save to localStorage
//     const applyThemeStyles = ( theme ) => {
//         document.documentElement.setAttribute( 'data-theme', theme );
//         localStorage.setItem( 'theme', theme );

//         const styles = theme === 'dark' ? {
//             '--coupon-gradient-start': '#1a202c',
//             '--coupon-gradient-end': '#2d3748',
//             '--how-it-works-gradient-start': '#2d3748',
//             '--how-it-works-gradient-end': '#4a5568',
//             '--banner-main-text-color': '#E0F2FE',
//             '--banner-sub-text-color': '#BFDBFE',
//             '--banner-button-bg-color': '#60A5FA',
//             '--banner-button-shadow': '0px 0px 15px rgba(96, 165, 250, 0.4)'
//         } : {
//             '--coupon-gradient-start': '#9D00FF',
//             '--coupon-gradient-end': '#FF8DA1',
//             '--how-it-works-gradient-start': '#e0f2fe',
//             '--how-it-works-gradient-end': '#e0f7fa',
//             '--banner-main-text-color': '#1a202c',
//             '--banner-sub-text-color': '#4a5568',
//             '--banner-button-bg-color': '#007BFF',
//             '--banner-button-shadow': '0px 8px 15px rgba(0, 0, 0, 0.2)'
//         };

//         Object.entries( styles ).forEach( ( [ key, value ] ) => {
//             document.documentElement.style.setProperty( key, value );
//         } );
//     };

//     const toggleTheme = () => {
//         const newTheme = theme === 'light' ? 'dark' : 'light';
//         setTheme( newTheme );
//         applyThemeStyles( newTheme );
//     };

//     return (
//         <div>
//             <button
//                 onClick={ toggleTheme }
//                 className="btn btn-circle btn-outline shadow-lg"
//                 aria-label={ `Switch to ${ theme === 'light' ? 'dark' : 'light' } mode` }
//             >
//                 { theme === 'light' ? <FaMoon /> : <FaSun /> }
//             </button>
//         </div>
//     );
// };

// export default ThemeToggler;





import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
// import { useTheme } from './ThemeContext';

const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-circle btn-outline shadow-lg"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
};

export default ThemeToggler;

