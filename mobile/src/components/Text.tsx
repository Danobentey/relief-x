import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type Variant = 'H1' | 'H2' | 'H3' | 'H4' | 'Body' | 'BodyBold' | 'Small' | 'SmallBold' | 'Caption' | 'Button';

export interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: keyof typeof import('../theme/tokens').colors;
}

export const Text: React.FC<AppTextProps> = ({ variant = 'Body', style, color, children, ...rest }) => {
  const theme = useTheme();
  const t = theme.typography[variant];
  type ColorKeys = keyof typeof theme.colors;
  const finalColor = color ? theme.colors[color as ColorKeys] : theme.colors.textPrimary;
  return (
    <RNText
      accessibilityRole={variant.startsWith('H') ? 'header' : undefined}
      style={[
        styles.base,
        {
          fontFamily: t.family,
          fontWeight: t.weight as unknown as '400' | '500' | '600' | '700',
          fontSize: t.size,
          lineHeight: t.lineHeight,
          letterSpacing: t.letterSpacing,
          color: finalColor,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {},
});
