import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import AuthScreen from './src/screens/AuthScreen';
import { initRevenueCat } from './src/services/revenueCat';
import { env } from './src/config/env';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { ensureAnonAuth, subscribeAuth } from './src/services/firebase';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, DefaultTheme as NavLightTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaywallScreen from './src/screens/PaywallScreen';
import PainSelectionScreen from './src/screens/PainSelectionScreen';
import Questionnaire1Screen from './src/screens/Questionnaire1Screen';
import Questionnaire2Screen from './src/screens/Questionnaire2Screen';
import Questionnaire3Screen from './src/screens/Questionnaire3Screen';
import Questionnaire4Screen from './src/screens/Questionnaire4Screen';
import { OnboardingProvider, useOnboarding } from './src/context/OnboardingContext';
import WelcomeScreen from './src/screens/WelcomeScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();

export default function App() {
  const [forcedMode] = React.useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    let unsub = () => {};
    ensureAnonAuth().then(() => {
      initRevenueCat({
        apiKey: env.REVENUECAT_API_KEY_PUBLIC,
        entitlementId: env.REVENUECAT_ENTITLEMENT_ID,
        debug: env.APP_ENV !== 'production'
      }).catch((e) => {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn('RevenueCat init failed', e);
        }
      });
      unsub = subscribeAuth(() => {
        // re-sync entitlements on auth change
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        import('./src/services/revenueCat').then(m => m.syncEntitlements());
      });
    });
    return () => unsub();
  }, []);

  return (
    <ThemeProvider forcedMode={forcedMode}>
      <Root />
    </ThemeProvider>
  );
}

function Root() {
  const theme = useTheme();
  const navTheme = theme.colors.background === '#0E1112' ? NavDarkTheme : NavLightTheme;

  return (
    <NavigationContainer theme={navTheme}> 
      <OnboardingProvider>
        <SplashGate />
      </OnboardingProvider>
    </NavigationContainer>
  );
}

function SplashGate() {
  const { hydrated, completed, painAreas } = useOnboarding();
  const [authReady, setAuthReady] = React.useState(false);
  const [rcReady, setRcReady] = React.useState(false);

  React.useEffect(() => {
    let unsub = () => {};
    ensureAnonAuth().then(() => {
      setAuthReady(true);
      initRevenueCat({ apiKey: env.REVENUECAT_API_KEY_PUBLIC, entitlementId: env.REVENUECAT_ENTITLEMENT_ID, debug: env.APP_ENV !== 'production' })
        .then(() => setRcReady(true))
        .catch(() => setRcReady(true));
      unsub = subscribeAuth(() => {
        import('./src/services/revenueCat').then(m => m.syncEntitlements());
      });
    });
    return () => unsub();
  }, []);

  React.useEffect(() => {
    if (hydrated && authReady && rcReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated, authReady, rcReady]);

  if (!hydrated || !authReady || !rcReady) {
    return null; // keep splash
  }
  const initial = completed ? 'Auth' : (painAreas.length ? 'Questionnaire1' : 'PainSelection');

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initial}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
      <Stack.Screen name="PainSelection" component={PainSelectionScreen} />
      <Stack.Screen name="Questionnaire1" component={Questionnaire1Screen} />
      <Stack.Screen name="Questionnaire2" component={Questionnaire2Screen} />
      <Stack.Screen name="Questionnaire3" component={Questionnaire3Screen} />
      <Stack.Screen name="Questionnaire4" component={Questionnaire4Screen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
}
