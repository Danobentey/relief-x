import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { track } from '../analytics';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useOnboarding } from '../context/OnboardingContext';

export const Questionnaire4Screen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const { setAnswer, answers, markCompleted } = useOnboarding();
  const current = answers.q4;
  const [answer, setLocalAnswer] = useState<string | null>(current || null);
  useEffect(() => { track('pr_onboarding_step_view', { step: 'questionnaire_4' }); }, []);
  function choose(val: string) { setLocalAnswer(val); setAnswer('q4', val); }
  function finish() { markCompleted(); navigation.navigate('Auth' as never); }
  return (
    <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.inner}> 
        <Text variant="H2" style={styles.title}>What is your main goal?</Text>
        <Text variant="Body" color="textSecondary">Select one.</Text>
        <View style={styles.options}>
          {['Reduce pain', 'Improve mobility', 'Build strength', 'Prevent recurrence'].map(o => (
            <Button key={o} label={o} variant={answer === o ? 'primary' : 'secondary'} onPress={() => choose(o)} fullWidth />
          ))}
        </View>
        <Button label="Finish" onPress={finish} disabled={!answer} fullWidth />
      </View>
    </ScrollView>
  );
};
export default Questionnaire4Screen;

const styles = StyleSheet.create({
  inner: { flexGrow: 1, gap: 20, justifyContent: 'flex-start', padding: 24 },
  options: { gap: 12 },
  scroll: { flexGrow: 1 },
  title: { marginBottom: 4 },
});
