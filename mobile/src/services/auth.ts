// High-level auth service abstraction
import { ensureAnonAuth, signInEmail, signUpEmail, signOutUser, auth, sendResetEmail, upsertUserProfile } from './firebase';
import { track } from '../analytics';
import { recordError } from '../analytics/errorFunnel';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSessionPkg from 'expo-auth-session';
import { getAuth, OAuthProvider, signInWithCredential, AuthCredential, GoogleAuthProvider } from 'firebase/auth';
import { env } from '../config/env';

async function firebaseCredentialFromIdToken(provider: 'apple' | 'google', idToken: string, nonce?: string) {
  if (provider === 'apple') {
    const appleProvider = new OAuthProvider('apple.com');
    const credential = appleProvider.credential({ idToken, rawNonce: nonce });
    return credential as AuthCredential;
  }
  if (provider === 'google') {
    return GoogleAuthProvider.credential(idToken);
  }
  throw new Error('Unsupported provider');
}

export async function initAuth() {
  await ensureAnonAuth();
}

export async function emailSignUp(email: string, password: string, fullName?: string) {
  try {
    const cred = await signUpEmail(email, password);
    if (fullName) {
      await upsertUserProfile(cred.user.uid, { fullName });
    }
    await track('pr_auth_login', { method: 'email_signup' });
    return cred.user;
  } catch (e) {
    await recordError('auth_fail', 'auth');
    throw e;
  }
}

export async function emailSignIn(email: string, password: string) {
  try {
    const cred = await signInEmail(email, password);
    await track('pr_auth_login', { method: 'email_signin' });
    return cred.user;
  } catch (e) {
    await recordError('auth_fail', 'auth');
    throw e;
  }
}

export async function signOutApp() {
  await signOutUser();
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function appleSignIn() {
  try {
    const response = await AppleAuthentication.signInAsync({ requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL, AppleAuthentication.AppleAuthenticationScope.FULL_NAME] });
    if (!response.identityToken) throw new Error('No identity token');
    const cred = await firebaseCredentialFromIdToken('apple', response.identityToken, (response as unknown as { nonce?: string }).nonce);
    const userCred = await signInWithCredential(getAuth(), cred);
    await track('pr_auth_login', { method: 'apple' });
    return userCred.user;
  } catch (e) {
    await recordError('auth_fail', 'auth');
    throw e;
  }
}

function getAuthSessionHelpers() {
  type AuthSessionModule = {
    makeRedirectUri: (options?: { path?: string }) => string;
    startAsync: (cfg: { authUrl: string }) => Promise<{ type: string; params?: Record<string, string> }>;

  };
  const mod = AuthSessionPkg as unknown as AuthSessionModule;
  return { makeRedirectUri: mod.makeRedirectUri, startAsync: mod.startAsync };
}

export async function googleSignIn() {
  try {
    const { makeRedirectUri, startAsync } = getAuthSessionHelpers();
    const redirectUri = makeRedirectUri();
    const clientId = env.GOOGLE_OAUTH_CLIENT_ID;
    if (!clientId) throw new Error('Missing GOOGLE_OAUTH_CLIENT_ID');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20email%20profile`;
    const result: unknown = await startAsync({ authUrl });
    const r = result as { type?: string; params?: { id_token?: string } };
    if (r.type !== 'success' || !r.params?.id_token) throw new Error('Google auth failed');
    const cred = await firebaseCredentialFromIdToken('google', r.params.id_token);
    const userCred = await signInWithCredential(getAuth(), cred);
    await track('pr_auth_login', { method: 'google' });
    return userCred.user;
  } catch (e) {
    await recordError('auth_fail', 'auth');
    throw e;
  }
}

export function passwordReset(email: string) {
  return sendResetEmail(email);
}
