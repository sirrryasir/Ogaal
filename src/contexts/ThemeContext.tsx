import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themes, { Theme } from '../theme';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeType, setThemeTypeState] = useState<ThemeType>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        setThemeTypeState(saved);
      }
    };
    loadTheme();
  }, []);

  const setThemeType = async (type: ThemeType) => {
    setThemeTypeState(type);
    await AsyncStorage.setItem('theme', type);
  };

  const theme = themes[themeType];

  return (
    <ThemeContext.Provider value={{ theme, themeType, setThemeType }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};