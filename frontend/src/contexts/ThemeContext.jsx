import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const initialTheme = localStorage.getItem('theme') || 'light';
  const [darkmode, setDarkmode] = useState(initialTheme === 'dark');

  // Sync the theme across tabs
  useEffect(() => {
    // Update the document's class based on darkmode state
    if (darkmode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Store the current theme in localStorage
    localStorage.setItem('theme', darkmode ? 'dark' : 'light');
  }, [darkmode]);

  // Listen for changes in localStorage from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'theme') {
        // Update the darkmode state if localStorage 'theme' changes
        setDarkmode(event.newValue === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleDarkmode = () => {
    setDarkmode(!darkmode); // Toggle dark mode
  };

  return (
    <ThemeContext.Provider value={{ darkmode, toggleDarkmode }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ThemeContext, ThemeProvider };
