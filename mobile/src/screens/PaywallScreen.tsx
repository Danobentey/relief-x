import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { purchase, restore, getEntitlement, EntitlementState } from '../services/revenueCat';
import { track } from '../analytics';
import { recordError } from '../analytics/errorFunnel';

interface PaywallScreenProps {
  source?: string; // analytics source (required by pr_paywall_view)
}

const planMeta: { key: 'monthly' | 'annual'; label: string; desc: string }[] = [
  { key: 'monthly', label: 'Monthly', desc: 'Cancel anytime' },
  { key: 'annual', label: 'Annual', desc: '2 months free' },
];

const featureBullets = [
  'Daily guided relief sessions',
  'Personalized routines for your pain areas',
  'Track pain trends & progress',
  'Premium expert video library',
  'Adaptive recommendations over time',
];

export const PaywallScreen: React.FC<PaywallScreenProps> = ({ source = 'auth' }) => {
  const theme = useTheme();
  const [selected, setSelected] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [entitlement, setEntitlement] = useState<EntitlementState>(() => getEntitlement());

  useEffect(() => {
    track('pr_paywall_view', { source });
  }, [source]);

  const onPurchase = useCallback(async () => {
    setLoading(true);
    try {
      const state = await purchase(selected);
      setEntitlement(state);
      if (state.status === 'active' || state.status === 'trial') {
        Alert.alert('Success', 'Subscription activated.');
      }
    } catch (e: unknown) {
      recordError('purchase_fail', 'purchase');
      Alert.alert('Purchase Failed', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selected]);

  const onRestore = useCallback(async () => {
    setRestoring(true);
    try {
      const state = await restore();
      setEntitlement(state);
      Alert.alert('Restore', 'Purchases restored.');
    } catch (e: unknown) {
      recordError('restore_fail', 'purchase');
      Alert.alert('Restore Failed', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setRestoring(false);
    }
  }, []);

  if (entitlement.status === 'active' || entitlement.status === 'trial') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
        <Text variant="H3" style={styles.title}>You are premium</Text>
        <Text variant="Body" color="textSecondary">Status: {entitlement.status}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text variant="H2" style={styles.title}>Go Premium</Text>
      <Text variant="Body" color="textSecondary" style={styles.subtitle}>Unlock the full guided recovery library.</Text>
      <View style={styles.features}>
        {featureBullets.map(b => (
          <Text key={b} variant="Small" color="textSecondary">• {b}</Text>
        ))}
      </View>
      <View style={styles.planGrid}>
        {planMeta.map((p) => {
          const active = selected === p.key;
          const isAnnual = p.key === 'annual';
          return (
            <Card
              key={p.key}
              elevated={active ? 2 : 1}
              padding={16}
              radius="md"
              style={[
                styles.planCard,
                active && styles.planCardSelected,
                active && { borderColor: theme.colors.brandPrimary },
                isAnnual && active && { backgroundColor: theme.colors.brandPrimarySubtle },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onTouchEnd={() => setSelected(p.key)}
            >
              <View style={styles.planHeaderRow}>
                <Text variant="H4">{p.label}</Text>
                {isAnnual && (
                  <View style={[styles.badge, { backgroundColor: theme.colors.brandPrimarySubtle, borderColor: theme.colors.brandPrimary }]}>
                    <Text variant="Caption" color="brandPrimary">7-Day Trial</Text>
                  </View>
                )}
              </View>
              {p.key === 'monthly' && (
                <Text variant="Small" color="textSecondary" style={styles.priceLine}>$14.99 / month</Text>
              )}
              {p.key === 'annual' && (
                <>
                  <Text variant="Small" color="textSecondary" style={styles.priceLine}>$99.99 / year</Text>
                  <Text variant="Caption" color="textSecondary" style={styles.subPrice}>≈ $8.33 / mo after trial</Text>
                </>
              )}
              <Text variant="Small" color="textSecondary" style={styles.planDesc}>{p.desc}</Text>
            </Card>
          );
        })}
      </View>

      <Button
        label={loading ? 'Processing...' : selected === 'annual' ? 'Start 7-Day Free Trial' : 'Continue – $14.99/mo'}
        variant="primary"
        onPress={onPurchase}
        disabled={loading}
        fullWidth
      />
      <Button
        label={restoring ? 'Restoring...' : 'Restore Purchases'}
        variant="text"
        onPress={onRestore}
        disabled={restoring || loading}
        fullWidth
      />
      <Text variant="Caption" color="textSecondary" style={styles.disclaimer}>
        7-day trial available on annual plan. Then $99.99/year (auto-renews). Cancel anytime in App Store settings.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  container: { flex: 1, gap: 16, padding: 24 },
  disclaimer: { marginTop: 24, textAlign: 'center' },
  features: { gap: 4, marginBottom: 4 },
  planCard: { flex: 1, gap: 4 },
  planCardSelected: { borderWidth: 2 },
  planDesc: { marginTop: 4 },
  planGrid: { flexDirection: 'row', gap: 12 },
  planHeaderRow: { alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  priceLine: { marginTop: 4 },
  subPrice: { marginTop: 2 },
  subtitle: { marginBottom: 8 },
  title: { marginBottom: 4 },
});

export default PaywallScreen;
