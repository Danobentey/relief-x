import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../components/Text';
import Chip from '../components/Chip';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { track } from '../analytics';
import { useOnboarding } from '../context/OnboardingContext';

const PAIN_AREAS = ['Neck', 'Shoulders', 'Lower Back', 'Upper Back', 'Hips', 'Knees', 'Ankles', 'Wrists'];

interface NavLike { navigate: (screen: string, params?: Record<string, unknown>) => void }

export const PainSelectionScreen: React.FC<{ navigation: NavLike }> = ({ navigation }) => {
  const theme = useTheme();
  const { painAreas, setPainAreas } = useOnboarding();
  const selected = painAreas;

  useEffect(() => {
    track('pr_onboarding_step_view', { step: 'pain_selection' });
  }, []);

  function toggle(area: string) {
    setPainAreas(selected.includes(area) ? selected.filter(a => a !== area) : [...selected, area]);
  }

  function next() {
    navigation.navigate('Questionnaire1', { painAreas: selected });
  }

  return (
    <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.inner}> 
        <Text variant="H2" style={styles.title}>Where do you feel pain?</Text>
        <Text variant="Body" color="textSecondary" style={styles.subtitle}>Select all that apply.</Text>
        <View style={styles.grid}>
          {PAIN_AREAS.map(area => (
            <Chip key={area} label={area} selected={selected.includes(area)} onPress={() => toggle(area)} />
          ))}
        </View>
        <Button label="Continue" onPress={next} disabled={!selected.length} fullWidth />
      </View>
    </ScrollView>
  );
};

export default PainSelectionScreen;

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  inner: { flexGrow: 1, gap: 20, justifyContent: 'flex-start', padding: 24 },
  scroll: { flexGrow: 1 },
  subtitle: { marginBottom: 8 },
  title: { marginBottom: 4 },
});
