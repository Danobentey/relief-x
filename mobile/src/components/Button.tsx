import React from 'react';
import { Pressable, ActivityIndicator, StyleSheet, ViewStyle, PressableProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'text';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, variant = 'primary', loading, fullWidth, disabled, ...rest }) => {
  const theme = useTheme();

  function getBg(state: 'default' | 'pressed') {
    if (variant === 'primary') return state === 'pressed' ? theme.state.buttonPrimaryBg.pressed : theme.state.buttonPrimaryBg.default;
    if (variant === 'secondary') return theme.colors.surface;
    return 'transparent';
  }
  function getBorder(state: 'default' | 'pressed'): string | undefined {
    if (variant === 'secondary') return state === 'pressed' ? theme.state.buttonSecondaryBorder.pressed : theme.state.buttonSecondaryBorder.default;
    return undefined;
  }
  const textColor = variant === 'primary' ? theme.colors.textInverted : theme.colors.brandPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: getBg(pressed ? 'pressed' : 'default'),
          borderColor: getBorder(pressed ? 'pressed' : 'default'),
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text variant="Button" color={variant === 'primary' ? 'textInverted' : 'brandPrimary'}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  } as ViewStyle,
  fullWidth: { alignSelf: 'stretch' },
});
