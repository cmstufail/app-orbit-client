// ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ( { children } ) => {
    const [ theme, setTheme ] = useState( localStorage.getItem( "theme" ) || "light" );

    useEffect( () => {
        document.documentElement.setAttribute( "data-theme", theme );
        localStorage.setItem( "theme", theme );
    }, [ theme ] );

    const toggleTheme = () => setTheme( theme === "light" ? "dark" : "light" );

    return (
        <ThemeContext.Provider value={ { theme, toggleTheme } }>
            { children }
        </ThemeContext.Provider>
    );
};

// useTheme hook
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext( ThemeContext );
