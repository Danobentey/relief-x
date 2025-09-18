import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useTheme } from '../theme/ThemeProvider';
import { emailSignIn, emailSignUp, appleSignIn, googleSignIn, passwordReset } from '../services/auth';
import Divider from '../components/Divider';

const AuthScreen: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);
  const toggleMode = () => setMode(m => (m === 'signin' ? 'signup' : 'signin'));
  const submit = async () => {
    setLoading(true);
    try {
      if (mode === 'signin') {
        await emailSignIn(email.trim(), password);
      } else {
        await emailSignUp(email.trim(), password, fullName.trim() || undefined);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      if (__DEV__) console.warn('auth error', e);
    } finally {
      setLoading(false);
    }
  };
  const onForgot = async () => {
    if (!email.trim()) return;
    try {
      await passwordReset(email.trim());
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (e) {
      if (__DEV__) console.warn('reset error', e);
    }
  };
  return (
    <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.colors.background }]}>
      <View style={styles.inner}>
        <Text variant="H2" style={styles.title}>
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Text>
        <View style={styles.socialRow}>
          <Button label="Apple" variant="secondary" onPress={appleSignIn} fullWidth />
          <Button label="Google" variant="secondary" onPress={googleSignIn} fullWidth />
        </View>
        <View style={styles.dividerWrap}>
          <Divider />
          <Text variant="SmallBold" color="textSecondary">
            or continue with email
          </Text>
          <Divider />
        </View>
        {mode === 'signup' && (
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        )}
        <Input
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
          textContentType="emailAddress"
        />
        <Input
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          textContentType="password"
        />
        <Button
          label={loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          fullWidth
          onPress={submit}
          disabled={loading}
        />
        {mode === 'signin' && (
          <Button
            label={resetSent ? 'Reset Email Sent' : 'Forgot Password?'}
            variant="text"
            onPress={onForgot}
            fullWidth
          />
        )}
        <Button
          label={mode === 'signin' ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
          variant="text"
          onPress={toggleMode}
          fullWidth
        />
        <Text variant="Caption" color="textSecondary" style={styles.footerCopy}>
          By continuing you accept the Terms & Privacy.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  dividerWrap: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  footerCopy: { marginTop: 32, textAlign: 'center' },
  inner: { flexGrow: 1, gap: 16, justifyContent: 'center', padding: 24 },
  scroll: { flexGrow: 1 },
  socialRow: { flexDirection: 'row', gap: 12 },
  title: { marginBottom: 24 },
});
