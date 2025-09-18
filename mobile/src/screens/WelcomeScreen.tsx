import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useOnboarding } from '../context/OnboardingContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export const WelcomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const { painAreas, answers } = useOnboarding();
  const name = (answers.fullName as string | undefined) || 'There';
  function goAuth() { navigation.navigate('Auth' as never); }
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text variant="H2" style={styles.title}>Welcome, {name}!</Text>
      <Text variant="Body" color="textSecondary">You&apos;re all set. We tailored your plan for {painAreas.length || 'your'} pain area{painAreas.length === 1 ? '' : 's'}.</Text>
      <Button label="Continue" onPress={goAuth} fullWidth />
    </View>
  );
};
export default WelcomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16, justifyContent: 'center', padding: 24 },
  title: { marginBottom: 8 },
});
