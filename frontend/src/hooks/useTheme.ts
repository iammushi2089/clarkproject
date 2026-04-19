import { useState, useEffect } from 'react';

export const useTheme = () => {
  // Lazily initialize state from localStorage so it only runs once on mount
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'light';
  });

  // Sync the DOM body class whenever isLightMode changes
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'light' : 'dark');
      return newMode;
    });
  };

  return { isLightMode, toggleTheme };
};