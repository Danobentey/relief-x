import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export interface CardProps extends ViewProps {
  elevated?: boolean | number; // 0 (flat) | 1 | 2 | 3
  padding?: number; // spacing index or raw px
  radius?: 'sm' | 'md' | 'lg';
  backgroundColor?: keyof typeof import('../theme/tokens').colors;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevated = 0,
  padding = 16,
  radius = 'md',
  backgroundColor = 'surface',
  ...rest
}) => {
  const theme = useTheme();
  const rad = theme.radii[radius];
  const bg = theme.colors[backgroundColor];
  const elevationLevel = typeof elevated === 'boolean' ? (elevated ? 1 : 0) : elevated;
  const shadow = elevationLevel > 0 ? theme.elevation[elevationLevel as 1 | 2 | 3] : undefined;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: bg, borderRadius: rad, padding },
        shadow && Platform.select({
          ios: {
            shadowColor: shadow.ios.color,
            shadowOpacity: 1,
            shadowOffset: { width: shadow.ios.x, height: shadow.ios.y },
            shadowRadius: shadow.ios.blur / 2,
          },
          android: { elevation: shadow.android },
        }),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: { borderWidth: 0 },
});
