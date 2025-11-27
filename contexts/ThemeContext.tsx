import React, { createContext, useState, useContext, useEffect, useMemo, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export const lightColors = {
  primary: {
    gradient1: '#6B46C1',
    gradient2: '#9333EA',
    main: '#7C3AED',
    light: '#A78BFA',
    dark: '#5B21B6',
  },
  secondary: {
    gradient1: '#EC4899',
    gradient2: '#F472B6',
    main: '#DB2777',
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  error: '#EF4444',
  danger: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },
  warning: '#F59E0B',
  background: {
    primary: '#F9FAFB',
    secondary: '#F3F4F6',
    default: '#F9FAFB',
    paper: '#FFFFFF',
    gradient1: '#F3F4F6',
    gradient2: '#E5E7EB',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: {
    light: '#E5E7EB',
    main: '#D1D5DB',
  },
  categories: {
    food: '#F59E0B',
    transport: '#3B82F6',
    shopping: '#EC4899',
    entertainment: '#8B5CF6',
    bills: '#EF4444',
    health: '#10B981',
    other: '#6B7280',
  },
};

export const darkColors = {
  primary: {
    gradient1: '#8B5CF6',
    gradient2: '#A78BFA',
    main: '#9333EA',
    light: '#C4B5FD',
    dark: '#7C3AED',
  },
  secondary: {
    gradient1: '#F472B6',
    gradient2: '#FBCFE8',
    main: '#EC4899',
  },
  success: {
    main: '#34D399',
    light: '#6EE7B7',
    dark: '#10B981',
  },
  error: '#F87171',
  danger: {
    main: '#F87171',
    light: '#FCA5A5',
    dark: '#EF4444',
  },
  warning: '#FBBF24',
  background: {
    primary: '#111827',
    secondary: '#1F2937',
    default: '#111827',
    paper: '#1F2937',
    gradient1: '#1F2937',
    gradient2: '#374151',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    disabled: '#6B7280',
    inverse: '#FFFFFF',
  },
  border: {
    light: '#374151',
    main: '#4B5563',
  },
  categories: {
    food: '#FBBF24',
    transport: '#60A5FA',
    shopping: '#F472B6',
    entertainment: '#A78BFA',
    bills: '#F87171',
    health: '#34D399',
    other: '#9CA3AF',
  },
};

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  isDark: boolean;
  colors: typeof lightColors;
  toggleTheme: () => void;
  themeMode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  async function loadTheme() {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeMode(savedTheme);
      } else if (systemColorScheme) {
        setThemeMode(systemColorScheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    loadTheme();
  }, []);

  const isDark = useMemo(() => themeMode === 'dark', [themeMode]);
  const colors = useMemo(() => isDark ? darkColors : lightColors, [isDark]);

  const toggleTheme = useCallback(async () => {
    try {
      const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
      setThemeMode(newMode);
      await AsyncStorage.setItem('themeMode', newMode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [themeMode]);

  const value = useMemo(
    () => ({ isDark, colors, toggleTheme, themeMode }),
    [isDark, colors, toggleTheme]
  );

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
