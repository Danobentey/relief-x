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
  React.useEffect(() => {
    // hide splash when initial auth + revenuecat attempt done
    setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 800);
  }, []);
  const navTheme = theme.colors.background === '#0E1112' ? NavDarkTheme : NavLightTheme;
  return (
    <NavigationContainer theme={navTheme}> 
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
