import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { track } from '../analytics';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useOnboarding } from '../context/OnboardingContext';

export const Questionnaire2Screen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const route = useRoute();
  const { setAnswer, answers } = useOnboarding();
  const current = answers.q2;
  const [answer, setLocalAnswer] = useState<string | null>(current || null);
  useEffect(() => { track('pr_onboarding_step_view', { step: 'questionnaire_2' }); }, []);
  function choose(val: string) { setLocalAnswer(val); setAnswer('q2', val); }
  function next() {
    navigation.navigate('Questionnaire3', { ...(route.params as Record<string, unknown>), q2: answer } as never);
  }
  return (
    <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.inner}> 
        <Text variant="H2" style={styles.title}>How often does it affect daily tasks?</Text>
        <Text variant="Body" color="textSecondary">Select one.</Text>
        <View style={styles.options}>
          {['Rarely', 'Sometimes', 'Often', 'Always'].map(o => (
            <Button key={o} label={o} variant={answer === o ? 'primary' : 'secondary'} onPress={() => choose(o)} fullWidth />
          ))}
        </View>
        <Button label="Continue" onPress={next} disabled={!answer} fullWidth />
      </View>
    </ScrollView>
  );
};
export default Questionnaire2Screen;

const styles = StyleSheet.create({
  inner: { flexGrow: 1, gap: 20, justifyContent: 'flex-start', padding: 24 },
  options: { gap: 12 },
  scroll: { flexGrow: 1 },
  title: { marginBottom: 4 },
});
