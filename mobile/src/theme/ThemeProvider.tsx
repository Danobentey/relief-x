import React, { createContext, useContext, PropsWithChildren, useMemo } from 'react';
import { baseTheme, darkTheme, Theme } from './tokens';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext<Theme>(baseTheme);

interface ThemeProviderProps extends PropsWithChildren { forcedMode?: 'light' | 'dark' | 'system'; }

export function ThemeProvider({ children, forcedMode = 'system' }: ThemeProviderProps) {
  const system = useColorScheme();
  const value = useMemo(() => {
    const mode = forcedMode === 'system' ? system : forcedMode;
    return mode === 'dark' ? darkTheme : baseTheme;
  }, [forcedMode, system]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
