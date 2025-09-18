import React, { useState, useCallback, forwardRef } from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export interface InputProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  fullWidth?: boolean;
  onFocus?: (e: unknown) => void; // using any here avoided; replaced with unknown then cast inside
  onBlur?: (e: unknown) => void;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, helperText, error, editable = true, fullWidth = true, onFocus, onBlur, ...rest },
  ref
) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback((e: unknown) => {
    setFocused(true);
    onFocus?.(e);
  }, [onFocus]);
  const handleBlur = useCallback((e: unknown) => {
    setFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  const hasError = Boolean(error);
  const borderColor = hasError
    ? theme.state.inputBorder.error
    : focused
      ? theme.state.inputBorder.focus
      : theme.state.inputBorder.default;
  const backgroundColor = editable ? theme.state.inputBg.default : theme.state.inputBg.disabled;

  return (
    <View style={fullWidth ? styles.fullWidth : undefined}>
      {label && (
        <Text variant="SmallBold" style={styles.label} accessibilityLabel={label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.fieldWrapper,
          { borderColor, backgroundColor },
          !editable && styles.disabled,
        ]}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityState={{ disabled: !editable }}
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, { color: theme.colors.textPrimary }]}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </View>
      {(helperText || hasError) && (
        <Text variant="Caption" color={hasError ? 'error' : 'textSecondary'} style={styles.helper}>
          {typeof error === 'string' ? error : helperText}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  disabled: { opacity: 0.6 },
  fieldWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fullWidth: { alignSelf: 'stretch' },
  helper: { marginTop: 4 },
  input: {
    fontSize: 16,
    lineHeight: 24,
    margin: 0,
    padding: 0,
  },
  label: { marginBottom: 4 },
});
