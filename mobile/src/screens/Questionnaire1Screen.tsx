import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { track } from '../analytics';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useOnboarding } from '../context/OnboardingContext';

export const Questionnaire1Screen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { setAnswer, answers } = useOnboarding();
  const current = answers.q1;
  const [answer, setLocalAnswer] = useState<string | null>(current || null);
  useEffect(() => {
    track('pr_onboarding_step_view', { step: 'questionnaire_1' });
  }, []);
  function next() {
    // @ts-expect-error dynamic nav params for now
    navigation.navigate('Questionnaire2', { ...(route.params as Record<string, unknown>), q1: answer });
  }
  function choose(val: string) { setLocalAnswer(val); setAnswer('q1', val); }
  return (
    <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.inner}> 
        <Text variant="H2" style={styles.title}>How intense is your current pain?</Text>
        <Text variant="Body" color="textSecondary">Select one.</Text>
        <View style={styles.options}>
          {['Mild', 'Moderate', 'Severe'].map(o => (
            <Button key={o} label={o} variant={answer === o ? 'primary' : 'secondary'} onPress={() => choose(o)} fullWidth />
          ))}
        </View>
        <Button label="Continue" onPress={next} disabled={!answer} fullWidth />
      </View>
    </ScrollView>
  );
};

export default Questionnaire1Screen;

const styles = StyleSheet.create({
  inner: { flexGrow: 1, gap: 20, justifyContent: 'flex-start', padding: 24 },
  options: { gap: 12 },
  scroll: { flexGrow: 1 },
  title: { marginBottom: 4 },
});
