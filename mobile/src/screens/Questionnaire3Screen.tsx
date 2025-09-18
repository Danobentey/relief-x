import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { track } from '../analytics';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { useOnboarding } from '../context/OnboardingContext';

export const Questionnaire3Screen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const route = useRoute();
  const { setAnswer, answers } = useOnboarding();
  const current = answers.q3;
  const [answer, setLocalAnswer] = useState<string | null>(current || null);
  useEffect(() => { track('pr_onboarding_step_view', { step: 'questionnaire_3' }); }, []);
  function choose(val: string) { setLocalAnswer(val); setAnswer('q3', val); }
  function next() { navigation.navigate('Questionnaire4', { ...(route.params as Record<string, unknown>), q3: answer } as never); }
  return (
    <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.inner}> 
        <Text variant="H2" style={styles.title}>How long have you had this pain?</Text>
        <Text variant="Body" color="textSecondary">Select one.</Text>
        <View style={styles.options}>
          {['< 1 month', '1-3 months', '3-12 months', '> 1 year'].map(o => (
            <Button key={o} label={o} variant={answer === o ? 'primary' : 'secondary'} onPress={() => choose(o)} fullWidth />
          ))}
        </View>
        <Button label="Continue" onPress={next} disabled={!answer} fullWidth />
      </View>
    </ScrollView>
  );
};
export default Questionnaire3Screen;

const styles = StyleSheet.create({
  inner: { flexGrow: 1, gap: 20, justifyContent: 'flex-start', padding: 24 },
  options: { gap: 12 },
  scroll: { flexGrow: 1 },
  title: { marginBottom: 4 },
});
