import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    colors: isDark
      ? {
          // Tema oscuro
          background: '#1a1a1a',
          cardBackground: '#2a2a2a',
          text: '#ffffff',
          textSecondary: '#b0b0b0',
          primary: '#a04500ff',
          secondary: '#a04500ff',
          success: '#004202ff',
          danger: '#8a0900ff',
          border: '#444',
          shadow: '#000000',
          inputBackground: '#333333',
          buttonText: '#ffffff',
          icon: '#FF6F00',
          iconSecondary: '#ffffff',
          infoBackground: '#2a3f5f',
          skillBadgeBackground: '#3d2a00',
          infoCardBackground: '#3d2a00',
        }
      : {
          // Tema claro
          background: '#f5f5f5',
          cardBackground: '#fff',
          text: '#333',
          textSecondary: '#666',
          primary: '#FF6F00',
          secondary: '#ff7d27ff',
          success: '#4CAF50',
          danger: '#f44336',
          border: '#ddd',
          shadow: '#FF6F00',
          inputBackground: '#fafafa',
          buttonText: '#fff',
          icon: '#FF6F00',
          iconSecondary: '#333',
          infoBackground: '#E3F2FD',
          skillBadgeBackground: '#FFF3E0',
          infoCardBackground: '#FFF3E0',
        },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
