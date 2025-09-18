import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export const Divider: React.FC<ViewProps> = ({ style, ...rest }) => {
  const theme = useTheme();
  return <View style={[styles.line, { backgroundColor: theme.colors.divider } , style]} {...rest} />;
};

const styles = StyleSheet.create({
  line: { alignSelf: 'stretch', height: StyleSheet.hairlineWidth },
});

export default Divider;
